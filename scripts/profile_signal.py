import json
import os
import re
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get(
    "SIGNAL_BASE_URL",
    "http://127.0.0.1:5173/CremaWebsite/signal",
)
ROOT = Path(__file__).resolve().parents[1]
FRAME_DIRECTORY = ROOT / "public" / "assets" / "generated" / "signal-sequence-v4"
OUTPUT_DIRECTORY = ROOT / ".tmp"


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=1,
        has_touch=True,
        is_mobile=True,
    )
    page = context.new_page()
    cdp = context.new_cdp_session(page)
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    cdp.send(
        "Network.emulateNetworkConditions",
        {
            "offline": False,
            "latency": 150,
            "downloadThroughput": 1_600_000 / 8,
            "uploadThroughput": 750_000 / 8,
            "connectionType": "cellular4g",
        },
    )

    errors: list[str] = []
    frame_requests: set[int] = set()
    initial_frame_requests: set[int] = set()
    rich_media_requests: list[str] = []
    initial_route_assets: set[str] = set()
    deferred_route_assets: set[str] = set()
    scroll_started = False
    max_cache_size = 0
    max_pending_requests = 0

    page.on(
        "console",
        lambda message: errors.append(f"console:{message.type}:{message.text}")
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: errors.append(f"pageerror:{error}"))

    def record_request(request) -> None:
        url = request.url
        if request.resource_type in {"script", "stylesheet"}:
            asset_name = url.rsplit("/", 1)[-1].split("?", 1)[0]
            if scroll_started:
                deferred_route_assets.add(asset_name)
            else:
                initial_route_assets.add(asset_name)
        frame_match = re.search(r"signal-sequence-v4/frame-(\d{3})\.webp", url)
        if frame_match:
            frame = int(frame_match.group(1))
            frame_requests.add(frame)
            if not scroll_started:
                initial_frame_requests.add(frame)
        if re.search(r"dotlottie|crema-signal\.json|\.wasm(?:$|\?)", url, re.IGNORECASE):
            rich_media_requests.append(url)

    page.on("request", record_request)
    page.add_init_script(
        """
        window.__signalVitals = { cls: 0, longTasks: [], scrollStart: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__signalVitals.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__signalVitals.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }).observe({ type: 'longtask', buffered: true });
        """
    )

    page.goto(BASE_URL, wait_until="domcontentloaded", timeout=45_000)
    page.wait_for_selector(".signal-story-canvas", state="visible")
    page.wait_for_timeout(600)
    scroll_started = True

    scroll_profile = page.evaluate(
        """
        async () => {
          const story = document.querySelector('#story');
          const top = story.getBoundingClientRect().top + window.scrollY;
          const distance = Math.max(1, story.offsetHeight - window.innerHeight);
          const duration = 3200;
          const intervals = [];
          let previous = performance.now();
          const started = previous;
          window.__signalVitals.scrollStart = started;

          await new Promise((resolve) => {
            const tick = (now) => {
              intervals.push(now - previous);
              previous = now;
              const progress = Math.min(1, (now - started) / duration);
              window.scrollTo(0, top + distance * progress);
              if (progress < 1) requestAnimationFrame(tick);
              else resolve();
            };
            requestAnimationFrame(tick);
          });

          intervals.shift();
          intervals.sort((a, b) => a - b);
          const percentile = (value) =>
            intervals[Math.min(intervals.length - 1, Math.floor(intervals.length * value))] || 0;
          return {
            framesObserved: intervals.length,
            rafMedianMs: percentile(0.5),
            rafP95Ms: percentile(0.95),
            rafMaxMs: intervals.at(-1) || 0,
            slowFramesOver50Ms: intervals.filter((value) => value > 50).length,
          };
        }
        """
    )

    for _ in range(12):
        diagnostics = page.locator(".signal-story-canvas").evaluate(
            """(canvas) => ({
              cacheSize: Number(canvas.dataset.cacheSize || 0),
              pendingRequests: Number(canvas.dataset.pendingRequests || 0),
            })"""
        )
        max_cache_size = max(max_cache_size, diagnostics["cacheSize"])
        max_pending_requests = max(max_pending_requests, diagnostics["pendingRequests"])
        page.wait_for_timeout(180)

    OUTPUT_DIRECTORY.mkdir(exist_ok=True)
    page.screenshot(path=OUTPUT_DIRECTORY / "signal-throttled-mobile.png")

    vitals = page.evaluate(
        """() => ({
          cls: window.__signalVitals.cls,
          longTasks: window.__signalVitals.longTasks,
          scrollStart: window.__signalVitals.scrollStart,
          renderedFrame: Number(document.querySelector('.signal-story-canvas')?.dataset.renderedFrame || 0),
          requestCount: Number(document.querySelector('.signal-story-canvas')?.dataset.requestCount || 0),
        })"""
    )
    requested_transfer_bytes = sum(
        (FRAME_DIRECTORY / f"frame-{frame:03d}.webp").stat().st_size
        for frame in frame_requests
    )
    initial_frame_bytes = sum(
        (FRAME_DIRECTORY / f"frame-{frame:03d}.webp").stat().st_size
        for frame in initial_frame_requests
    )
    long_tasks = vitals["longTasks"]
    initial_long_tasks = [
        task["duration"]
        for task in long_tasks
        if task["startTime"] < vitals["scrollStart"]
    ]
    scroll_long_tasks = [
        task["duration"]
        for task in long_tasks
        if task["startTime"] >= vitals["scrollStart"]
    ]
    result = {
        "profile": {
            "cpu_throttle": 4,
            "download_mbps": 1.6,
            "latency_ms": 150,
            "viewport": "390x844",
        },
        "story": {
            "diagnostic_request_count": vitals["requestCount"],
            "max_cache_size": max_cache_size,
            "max_pending_requests": max_pending_requests,
            "rendered_frame": vitals["renderedFrame"],
            "initial_frame_bytes": initial_frame_bytes,
            "initial_unique_frame_requests": len(initial_frame_requests),
            "requested_frame_bytes": requested_transfer_bytes,
            "unique_frame_requests": len(frame_requests),
        },
        "runtime": {
            **scroll_profile,
            "cls": vitals["cls"],
            "long_task_count": len(long_tasks),
            "initial_long_task_count": len(initial_long_tasks),
            "initial_long_task_max_ms": max(initial_long_tasks, default=0),
            "initial_long_task_total_ms": sum(initial_long_tasks),
            "initial_tbt_ms": sum(max(0, value - 50) for value in initial_long_tasks),
            "scroll_long_task_count": len(scroll_long_tasks),
            "scroll_long_task_max_ms": max(scroll_long_tasks, default=0),
            "scroll_long_task_total_ms": sum(scroll_long_tasks),
            "scroll_tbt_ms": sum(max(0, value - 50) for value in scroll_long_tasks),
        },
        "rich_media_requests": rich_media_requests,
        "route_assets": {
            "initial_scripts_and_styles": sorted(initial_route_assets),
            "deferred_scripts_and_styles": sorted(deferred_route_assets),
        },
        "errors": errors,
    }
    print(json.dumps(result, indent=2))

    assert max_cache_size <= 10, result
    assert max_pending_requests <= 3, result
    assert not initial_frame_requests, result
    assert len(frame_requests) <= 33, result
    assert requested_transfer_bytes <= 2_000_000, result
    assert vitals["renderedFrame"] > 0, result
    assert vitals["cls"] <= 0.1, result
    assert scroll_profile["rafP95Ms"] <= 100, result
    # Headless Chromium varies by tens of milliseconds across identical throttled runs;
    # cumulative TBT remains the stricter startup gate below.
    assert max(initial_long_tasks, default=0) <= 550, result
    assert sum(max(0, value - 50) for value in initial_long_tasks) <= 700, result
    assert max(scroll_long_tasks, default=0) <= 250, result
    assert sum(max(0, value - 50) for value in scroll_long_tasks) <= 500, result
    assert not rich_media_requests, result
    assert not errors, result

    context.close()
    browser.close()
