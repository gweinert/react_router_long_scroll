# single_page_router_scroll
A Higher Order Component that works with react router to automatically update the router if the component is on screen and also scrolls to components on page based on current route.

Setup Notes - 
	Each subcomponent or 'page' that needs to be scrolled to or router must be aware of must have data-path attribute. 
	`<div id="about" data-path="/about"></div>`/n
	However, if it is a react component
	`<Component dataPath="/my-component" {...this.props}/>`
	
	The HOC needs the window url pathname passed it as a prop
	
	Requires react router
	
If you are using react router, please use v2.4.0 as this component uses the router context object in order to update router state.

<h2>API</h2>

<h3>Callbacks</h3>
These can be called in the wrapped component or can be called by parent component

<table>
	<tr>
		<td>
			onScroll()
		</td>
		<td>
			This is called on every window scroll event
		</td>
	</tr>
	<tr>
		<td>
			onFinishedAnimatedScroll()
		</td>
		<td>
			Callback fired after window url updates and window scrolls to that componentt
		</td>
	</tr>
</table>

<h3>Props</h3>
<table>
	<tr>
		<td>
			percentageOnScreen
		</td>
		<td>
			Pass this prop a number between 1 and 0. Used as a percentage to define at what amount of the component needs to be in viewport height inorder to update the route.
			For example use 0.5 to tell the app to update the route if the component takes up at least 50% of the viewport height
		</td>
	</tr>
</table>

<h2>Set Up</h2>
Some setup is required outside of the wrapped component. At the moment this app depends on react router.
1. Needs an app container component
2. Needs a location prop passed to it from react router.
	- needs at least location = {pathname: "/route-1"}
3. Use withRouter HOC with app container component
4. Pass router object through context

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
				{this.props.children}
    		</div>
		)
	}
}

export default withRouter(App)
```

<h2>React Router SetUp</h2>

```
import App from './components/containers/App.js';
import Home from './components/views/Home.js';
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

