const scene = creator.activeScene
const frameEnd = 120
const ease = {
  type: 'CUBIC_BEZIER',
  x1: 0.42,
  y1: 0,
  x2: 0.58,
  y2: 1,
}

for (const layer of [...scene.layers]) {
  layer.remove()
}

scene.name = 'Crema Signal'
scene.size = { width: 512, height: 512 }
scene.framerate = 30
scene.duration = 4
scene.backgroundColor = { r: 16, g: 12, b: 10 }

// Render stack, top -> bottom:
// Signal dots, cup highlight, cup body, handle, steam, saucer, halo, core.
const signalDots = scene.createShapeLayer({
  name: 'Signal dots',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
signalDots.createEllipse({ position: { x: 256, y: 54 }, size: { width: 18, height: 18 } })
signalDots.createEllipse({ position: { x: 424, y: 256 }, size: { width: 12, height: 12 } })
signalDots.createEllipse({ position: { x: 88, y: 256 }, size: { width: 12, height: 12 } })
signalDots.createFill({ type: 'SOLID', color: { r: 168, g: 233, b: 90 } })
signalDots.rotation.addKeyframes([
  { frame: 0, value: 0, easing: ease },
  { frame: frameEnd, value: 360, easing: ease },
])
signalDots.scale.addKeyframes([
  { frame: 0, value: { x: 92, y: 92 }, easing: ease },
  { frame: 60, value: { x: 108, y: 108 }, easing: ease },
  { frame: frameEnd, value: { x: 92, y: 92 }, easing: ease },
])

const cupHighlight = scene.createShapeLayer({
  name: 'Cup highlight',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
cupHighlight.createRectangle({
  position: { x: 220, y: 316 },
  size: { width: 32, height: 112 },
  roundness: 16,
})
cupHighlight.createFill({ type: 'SOLID', color: { r: 255, g: 223, b: 190 } })
cupHighlight.opacity.staticValue = 44
cupHighlight.position.addKeyframes([
  { frame: 0, value: { x: -8, y: 0 }, easing: ease },
  { frame: 60, value: { x: 8, y: 0 }, easing: ease },
  { frame: frameEnd, value: { x: -8, y: 0 }, easing: ease },
])

const cupBody = scene.createShapeLayer({
  name: 'Orange cup',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
cupBody.createEllipse({
  position: { x: 256, y: 252 },
  size: { width: 244, height: 70 },
})
cupBody.createRectangle({
  position: { x: 256, y: 319 },
  size: { width: 244, height: 150 },
  roundness: 52,
})
cupBody.createFill({
  type: 'GRADIENT_LINEAR',
  start: { x: 130, y: 250 },
  end: { x: 382, y: 390 },
  stops: [
    { color: { r: 255, g: 130, b: 52 }, offset: 0, opacity: 100 },
    { color: { r: 255, g: 76, b: 18 }, offset: 1, opacity: 100 },
  ],
})
cupBody.scale.addKeyframes([
  { frame: 0, value: { x: 96, y: 96 }, easing: ease },
  { frame: 60, value: { x: 102, y: 102 }, easing: ease },
  { frame: frameEnd, value: { x: 96, y: 96 }, easing: ease },
])

const handle = scene.createShapeLayer({
  name: 'Cup handle',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
handle.createEllipse({
  position: { x: 386, y: 316 },
  size: { width: 116, height: 102 },
})
handle.createStroke({
  fill: { type: 'SOLID', color: { r: 255, g: 90, b: 24 } },
  width: 30,
})
handle.scale.addKeyframes([
  { frame: 0, value: { x: 94, y: 94 }, easing: ease },
  { frame: 60, value: { x: 103, y: 103 }, easing: ease },
  { frame: frameEnd, value: { x: 94, y: 94 }, easing: ease },
])

const steamLime = scene.createShapeLayer({
  name: 'Lime steam',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
steamLime.createPath({
  points: [
    { vertex: { x: 216, y: 230 }, inTan: { x: 0, y: 0 }, outTan: { x: -34, y: -34 } },
    { vertex: { x: 226, y: 176 }, inTan: { x: -30, y: 18 }, outTan: { x: 34, y: -24 } },
    { vertex: { x: 214, y: 118 }, inTan: { x: 28, y: 22 }, outTan: { x: 0, y: 0 } },
  ],
  closed: false,
})
steamLime.createStroke({
  fill: { type: 'SOLID', color: { r: 168, g: 233, b: 90 } },
  width: 14,
})
const limeTrim = steamLime.createTrimPath({ start: 0, end: 0, offset: 0 })
limeTrim.end.addKeyframes([
  { frame: 0, value: 0, easing: ease },
  { frame: 44, value: 100, easing: ease },
  { frame: 82, value: 100, easing: ease },
  { frame: frameEnd, value: 0, easing: ease },
])
steamLime.position.addKeyframes([
  { frame: 0, value: { x: 0, y: 12 }, easing: ease },
  { frame: 60, value: { x: 0, y: -8 }, easing: ease },
  { frame: frameEnd, value: { x: 0, y: 12 }, easing: ease },
])

const steamOrange = scene.createShapeLayer({
  name: 'Orange steam',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
steamOrange.createPath({
  points: [
    { vertex: { x: 292, y: 230 }, inTan: { x: 0, y: 0 }, outTan: { x: 34, y: -32 } },
    { vertex: { x: 282, y: 178 }, inTan: { x: 30, y: 18 }, outTan: { x: -34, y: -24 } },
    { vertex: { x: 298, y: 122 }, inTan: { x: -26, y: 20 }, outTan: { x: 0, y: 0 } },
  ],
  closed: false,
})
steamOrange.createStroke({
  fill: { type: 'SOLID', color: { r: 255, g: 90, b: 24 } },
  width: 14,
})
const orangeTrim = steamOrange.createTrimPath({ start: 0, end: 0, offset: 0 })
orangeTrim.end.addKeyframes([
  { frame: 0, value: 0, easing: ease },
  { frame: 20, value: 0, easing: ease },
  { frame: 64, value: 100, easing: ease },
  { frame: 100, value: 100, easing: ease },
  { frame: frameEnd, value: 0, easing: ease },
])
steamOrange.position.addKeyframes([
  { frame: 0, value: { x: 0, y: 4 }, easing: ease },
  { frame: 60, value: { x: 0, y: -12 }, easing: ease },
  { frame: frameEnd, value: { x: 0, y: 4 }, easing: ease },
])

const saucer = scene.createShapeLayer({
  name: 'Saucer',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
saucer.createEllipse({
  position: { x: 256, y: 410 },
  size: { width: 314, height: 50 },
})
saucer.createFill({ type: 'SOLID', color: { r: 168, g: 233, b: 90 } })
saucer.opacity.staticValue = 88

const halo = scene.createShapeLayer({
  name: 'Signal halo',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
halo.createEllipse({
  position: { x: 256, y: 256 },
  size: { width: 420, height: 420 },
})
halo.createStroke({
  fill: { type: 'SOLID', color: { r: 255, g: 90, b: 24 } },
  width: 8,
})
halo.opacity.addKeyframes([
  { frame: 0, value: 18, easing: ease },
  { frame: 60, value: 58, easing: ease },
  { frame: frameEnd, value: 18, easing: ease },
])
halo.scale.addKeyframes([
  { frame: 0, value: { x: 88, y: 88 }, easing: ease },
  { frame: 60, value: { x: 106, y: 106 }, easing: ease },
  { frame: frameEnd, value: { x: 88, y: 88 }, easing: ease },
])

const core = scene.createShapeLayer({
  name: 'Coffee core',
  position: { x: 0, y: 0 },
  startFrame: 0,
  endFrame: frameEnd,
})
core.createEllipse({
  position: { x: 256, y: 256 },
  size: { width: 370, height: 370 },
})
core.createFill({
  type: 'GRADIENT_RADIAL',
  start: { x: 256, y: 256 },
  end: { x: 440, y: 256 },
  highlightAngle: -42,
  highlightLength: 25,
  stops: [
    { color: { r: 52, g: 27, b: 19 }, offset: 0, opacity: 100 },
    { color: { r: 16, g: 12, b: 10 }, offset: 1, opacity: 100 },
  ],
})

creator.selection.nodes = [cupBody]
creator.timeline.goToFrame(0)
creator.timeline.play()

console.log({
  apiVersion: creator.apiVersion,
  scene: scene.name,
  size: scene.size,
  duration: scene.duration,
  framerate: scene.framerate,
  layers: scene.layers.map((layer) => layer.name),
})
