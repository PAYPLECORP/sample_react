import React from "react";
import Order from "./components/Order";
import OrderConfirm from "./components/OrderConfirm";
import OrderResult from "./components/OrderResult";
import NotFound from "./components/NotFound";
import {Route, Switch, Redirect} from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <Redirect to="/react/order"/>
                </Route>
                <Route path="/react/order" component={Order}/>
                <Route path="/react/order_confirm" component={OrderConfirm}/>
                <Route path="/react/order_result" component={OrderResult}/>
                <Route path="*" component={NotFound}/>
            </Switch>
        </div>
    );
}

export default App;
