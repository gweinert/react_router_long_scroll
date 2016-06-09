# single_page_router_scroll
A Higher Order Component that works with react router to update the router on scroll and also scrolls to components on page.

Notes - 
	Each subcomponent or 'page' that you want to be scrolled to/ router updated if on screen must have data-path if normal html or dataPath if it is a React Component
	This is best used with react router, but can be used without as the component uses History API for messing with browser history/url/state.

	The HOC needs the window's pathname passed it as a prop
	
If you are using react router, please use v2.4.0 as this component uses the router context object in order to update router state.

<h2>API</h2>

<h3>Callbacks</h3>
These can be called in the wrapped component or can be called by parent component

onScroll(): this is called on every window scroll event

onFinishedAnimatedScroll(): callback after window url updates and window scrolls to that component

percentageOnScreen: Must be 1.0 or less. Used as the percentage of the screen height from bottom where it is used to see if the component is inside viewheight of the app and it will update the router/route.
					So, 0.5 will be if component takes up at least 50% of screen height
					0.7, will update if component takes up 70% of screen height

<h2>Demo</h2>

```
import Scroll from 'single_page_router_scroll';

class Home extends React.Component {
	
	constructor(props) {
		super(props)
	}

	onScroll() {
		console.log("our app is being scrolled")
	}

	onFinishedAnimatedScroll() {
		console.log("just finished scrolling to component")
	}
	
	render() {
		
		return (
			<div className="" >
				
				// all "sections" need a data-path attribute and a ref
				<div className="about" data-path="/about">
					<p>Stuff</p>
					<p>More Stuff</p>
				</div>
				
				<div className="contact data-path="/contact" >
					<form>
						<input type="email" id="email_signup" />
					</form>
				</div>
				
				// component should have 'data-path' prop in its render function
				<Component1 ref="component1" dataPath="/my-component"/>
				
			</div>
		)
	}
}

export default Scroll(Home);

```


<h2>Main App Usage</h2>

```
import {withRouter} from 'react-router'

class App extends React.Component {
	static childContextTypes = {
		router: React.PropTypes.object.isRequrie,
	};

	constructor(props) {
		super(props);
	};
	
	getChildContext() {
		return {
			router: this.props.router,
		}
	}
	
	render() {
		return(
			<div className="page">
				{ React.cloneElement(this.props.children, {
            		className: `page`,
    			}) }
    		</div>
		)
	}
}

export default withRouter(App)
```

<h2>React Router SetUp</h2>

```
import App from './components/containers/App.js';
import Home from './components/views/Home.js;
import {
  browserHistory,
  hashHistory,
  IndexRoute,
  Redirect,
  Route,
  Router,
  applyRouterMiddleware
} from 'react-router';

class AppInitializer {
	run() {
		ReactDOM.render( 
			(<Router history= {window.history.pushState ? browserHistory : hashHistory }>
				<Route path="/" component={App} >
					<IndexRoute component={Home} />
				</Route>
			</Router>), document.querySelector('.wrapper')
		)
	}
}

```

