# single_page_router_scroll
A Higher Order Component that works with react router to update the router on scroll and also scrolls to components on page.

Notes - 
	Each subcomponent or 'page' must be given data attribute with data-url of the path. Must also give each 'page' a ref.
	This is best used with react router, but can be used without as the component uses History API for messing with browser history/url/state.
	
If you are using react router, please use v2.4.0 as this component uses the router context object in order to update router state.

<h2>Demo</h2>

```
import Scroll from 'single_page_router_scroll';

class Home extends React.Component {
	
	constructor(props) {
		super(props)
	}
	
	render() {
		
		return (
			<div className="" >
				
				// all "sections" need a data-path attribute and a ref
				<div className="about" data-path="/about" ref="about">
					<p>Stuff</p>
					<p>More Stuff</p>
				</div>
				
				<div className="contact data-path="/contact" ref="contact">
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

