
import ComponentActions from '../../../actions/ComponentActions.js';
import AnimateScrollToElement from './ScrollAnimator.js';


export default function scrollEnhance(ComposedComponent){
	return class extends React.Component {

		static contextTypes = {
			router: React.PropTypes.object
		};
		
		static PropTypes = {
			location: React.PropTypes.string.isRequired
		};

		static defaultProps = {
			location: "/"
		};

	
		constructor(props){
			super(props)
			this.state = {
				DOMcomponents: [],
				currentCompPath: null,
			}
			this.ticking = false
		}

		/******************************************************************************\
		 LIFECYCLE METHODS
		\******************************************************************************/

		componentDidMount() {
			window.addEventListener('scroll', this.handleScroll.bind(this))
			this.cacheDOMComponents()
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
		}


		shouldComponentUpdate(nextProps, nextState) {
			if(this.state.currentCompPath == nextState.currentCompPath){
				return false
			} else return true
		}

		componentDidUpdate(prevProps, prevState) {
			console.log("scroll", this)

			
			// if using react router update that, else use history api
			if(this.context && this.context.router){
				this.context.router.push(this.state.currentCompPath)
			} else{
				window.history.pushState(this.state.currentCompPath)
			}
		}

		componentWillUnmount() {
			window.removeEventListener('scroll', this.handleScroll.bind(this))
		}

		/******************************************************************************\
		 COMPONENT METHODS
		\******************************************************************************/

		cacheDOMComponents() {
			const components = this.refs.component.refs
			const componentKeys = Object.keys(components)
			const DOMComponents = componentKeys.map(value => {
				return ReactDOM.findDOMNode(components[value])
			}).filter(node => {
				return node.dataset.path != "false"
			})
			
			this.setState({DOMcomponents: DOMComponents})
		}

		handleScroll(){
			const pos = window.scrollY
			if(this.state.canScroll){

				//throttles the scroll event
				if(!this.ticking) {
					window.requestAnimationFrame(() => {
						this.handleScrollingComponents(pos, () => {
							this.ticking = false
						})
					})
				}
				this.ticking = true
			}
		}

		//finds the latest component that scrolled onto screen and updates state
		handleScrollingComponents(pos, cb) {

			let possibleCenter = []
			
			// ex: this.state.DOMcomponents = [<Component1 id="Page1"/>, <Component2 id="Page2"/>, <Component3 id="Page3"/>]
			for(let i = 0 ; i < this.state.DOMcomponents.length  ; i++) {
				if(this.isComponentCenterScreen(this.state.DOMcomponents[i])) {
					possibleCenter.push(this.state.DOMcomponents[i])
				}
			}

			//grabs the most recent component on screen
			// component has data url to use for routing
			const centerComponent = possibleCenter[possibleCenter.length-1] ? possibleCenter[possibleCenter.length-1] : null
			const centerComponentPath = centerComponent != null ? centerComponent.dataset.path : "/"

			this.setState({currentCompPath: centerComponentPath}, cb())
		}

		// Return false if its below halfway up the viewport
		isComponentCenterScreen(component) {
			
			let rect     = component.getBoundingClientRect(),
			    vWidth   = window.innerWidth || doc.documentElement.clientWidth,
			    vHeight  = window.innerHeight || doc.documentElement.clientHeight   

			if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > (vHeight/2) )
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
		}


		/******************************************************************************\
		 COMPONENT VIEWS
		\******************************************************************************/

		render() {
			return <ComposedComponent {...this.props} ref="component"/>
		}
	}
}