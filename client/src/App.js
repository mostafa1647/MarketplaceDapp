import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./utils/drizzle/options";
import Index from "./pages/index";

const drizzle = new Drizzle(drizzleOptions);


const App = () => {
	return (
		<DrizzleContext.Provider drizzle={drizzle}>
			<DrizzleContext.Consumer>
				{
					drizzleContext => {
						const { drizzle, drizzleState, initialized } = drizzleContext;
						console.log({ drizzle, drizzleState, initialized });
						if (!initialized) {
							return <h1>Loading...</h1>
						}

						return (
							<div className="app">
								<Index
									drizzle={drizzle}
									drizzleState={drizzleState}
								/>
							</div>
						)
					}
				}
			</DrizzleContext.Consumer>
		</DrizzleContext.Provider>
	);
}

export default App;
