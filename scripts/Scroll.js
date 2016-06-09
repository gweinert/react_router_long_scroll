import AnimateScrollToElement from './ScrollAnimator.js';


export default function scrollEnhance(ComposedComponent){
	// return class extends React.Component {
	return class Enhancer extends ComposedComponent {

		static contextTypes = {
			router: React.PropTypes.object
		};
		
		static PropTypes = {
			location: React.PropTypes.string.isRequired,
			onScroll: React.PropTypes.function,
			onFinishAnimatedScroll: React.PropTypes.function,
			percentageOnScreen: React.PropTypes.number,
		};

		static defaultProps = {
			location: "/",
			onPageScroll: () => {},
			onFinishAnimatedScroll: () => {},
			percentageOnScreen: 0.5,
		};

	
		constructor(props){
			super(props)
			this.state = Object.assign({}, this.state, {
				DOMcomponents: [],
				currentCompPath: null,
			})
			this.ticking = false
		}

		/******************************************************************************\
		 LIFECYCLE METHODS
		\******************************************************************************/

		componentDidMount() {
			// super.componentDidMount()
			window.addEventListener('scroll', this.handleScroll.bind(this))
			this.cacheDOMComponents()
			super.componentDidMount ? super.componentDidMount() : null 
		}


		componentWillReceiveProps(nextProps) {
			
			//only compare one level deep paths
			const nextPath = `/${nextProps.location.pathname.split("/")[1]}`
			const currentPath = this.state.currentCompPath ? `/${this.state.currentCompPath.split("/")[1]}` : null
			
			if(currentPath != nextPath){
			// if(nextProps.location.pathname != this.state.currentCompPath){
				this.setState({
					canScroll: false, 
					currentCompPath: nextProps.location.pathname
				}, this.scrollToLocation)
			}

			super.componentWillReceiveProps ? super.componentWillReceiveProps() : null 
		}


		shouldComponentUpdate(nextProps, nextState) {
			if(this.state.currentCompPath == nextState.currentCompPath){
				return false
			} else if( super.shouldComponentUpdate){
				super.shouldComponentUpdate()
			} else {
				return true
			}
		}

		componentDidUpdate(prevProps, prevState) {
			
			// if using react router update that, else use history api
			if(this.context && this.context.router){
				this.context.router.push(this.state.currentCompPath)
			} else{
				window.history.pushState(null, null, this.state.currentCompPath)
			}

			super.componentDidUpdate ? super.componentDidUpdate() : null
		}

		componentWillUnmount() {
			window.removeEventListener('scroll', this.handleScroll.bind(this))
			super.componentWillUnmount ? super.componentWillUnmount() : null
		}

		/******************************************************************************\
		 COMPONENT METHODS
		\******************************************************************************/

		// gets all DOM nodes that are scrollable
		cacheDOMComponents() {
			const components = this.refs
			const componentKeys = Object.keys(components)
			const DOMScrollComponents = componentKeys.map(value => {

				//grabs DOM el if 'normal' DOM component if custom react dom component
				if( (components[value].dataset && components[value].dataset.dataPath) ||
					(components[value].props && components[value].props.dataPath)    ){
					return ReactDOM.findDOMNode(components[value])
				}
			}).filter( component => {return component != undefined})

			this.setState({DOMcomponents: DOMScrollComponents})
		}

		handleScroll(){
			const pos = window.scrollY
			if(this.state.canScroll){

				//throttles the scroll event
				if(!this.ticking) {
					console.log("scroll")
					window.requestAnimationFrame(() => {
						this.handleScrollingComponents(pos, () => {
							this.handleScrollCallbacks()
							this.ticking = false
						})
					})
				}
				this.ticking = true
			}
		}

		handleScrollCallbacks() {
			this.props.onPageScroll()
			super.onPageScroll ? super.onPageScroll() : null
		}

		//finds the latest component that scrolled onto screen and updates state
		handleScrollingComponents(pos, cb) {
			let possibleCenter = []
			
			for(let i = 0 ; i < this.state.DOMcomponents.length  ; i++) {
				if(this.isComponentCenterScreen(this.state.DOMcomponents[i])) {
					possibleCenter.push(this.state.DOMcomponents[i])
				}
			}

			// grabs the most recent component on screen
			// component has data url to use for routing
			const centerComponent = possibleCenter[possibleCenter.length-1] ? possibleCenter[possibleCenter.length-1] : null
			const centerComponentPath = centerComponent != null ? centerComponent.dataset.path : "/"

			if(this.state.currentCompPath != centerComponentPath){
				this.setState({currentCompPath: centerComponentPath}, cb())
			} else {
				cb()
			}
		}

		// Returns true if component is above the halfway point in the viewport
		isComponentCenterScreen(component) {
			
			let rect     = component.getBoundingClientRect(),
			    vWidth   = window.innerWidth || doc.documentElement.clientWidth,
			    vHeight  = window.innerHeight || doc.documentElement.clientHeight 

			// let percentageOnScreen = options.percentageOnScreen ? (1 - options.percentageOnScreen) : 0.5
			let percentageOnScreen = 1 - this.props.percentageOnScreen


			if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > (vHeight * percentageOnScreen) )
			    return false;

			return true
		}

		scrollToLocation() {
			const component = `/${this.state.currentCompPath.split("/")[1]}` //always grabs the 1 level deep path in order to scroll
			const el = document.getElementById(component)
			const targetPos = el ? (el.offsetTop) : 0 // if cant find element go to top

			AnimateScrollToElement(targetPos, this.onFinishScrolling.bind(this))
		}

		onFinishScrolling() {
			this.setState({canScroll: true})
			super.onFinishAnimatedScroll ? super.onFinishAnimatedScroll() : null
			this.props.onFinishAnimatedScroll()
		}


		/******************************************************************************\
		 COMPONENT VIEWS
		\******************************************************************************/

		render() {
			
			const elementsTree = super.render()

			const childComponents = elementsTree.props.children
			let children = React.Children.toArray(childComponents)
			.map( (child, index) => {
				return React.cloneElement(child, {
					ref: `child-${index}`
				})
			})

			return React.cloneElement(elementsTree, this.props, children)

		}
	}
}