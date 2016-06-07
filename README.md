# single_page_router_scroll
A Higher Order Component that works with react router to update the router on scroll and also scrolls to components on page.

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
