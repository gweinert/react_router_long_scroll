module.exports = function(targetPos, cb) {
	const duration = 1250
	const headerHeight = window.innerWidth < 769 ? 75 : 95
	// const start = document.body.scrollTop //doesnt work in firefox
	const start = window.scrollY
	// const el = document.getElementById(this.state.currentCompPath)
	// const targetPos = el ? (el.offsetTop - headerHeight) : 0 // if cant find element go to top
	let change = (targetPos - headerHeight) - start
	let increment = 20;


	const animateScroll = (elapsedTime) => {
		elapsedTime += increment
		let position = easeInOut(elapsedTime, start, change, duration)
		window.top.scroll(0, position)
		// window.scrollY = position

		if(elapsedTime < duration) {
			setTimeout( () => {
				animateScroll(elapsedTime)
			}, increment)
		} else {

			//finished scrolling
			cb ? cb() : null
		}
	}

	animateScroll(0)
}

function easeInOut(currentTime, start, change, duration) {
	currentTime /= duration / 2
	if(currentTime < 1) {
		return change / 2 * currentTime * currentTime + start
	}
	currentTime -= 1
	return -change / 2 * (currentTime * (currentTime - 2) - 1) + start
}