/* @refresh reload */
import { ModalProvider } from "./global/Modal";
import Identity from "./global/Identity";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "greset";
import "./index.scss";
import App from "./App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?",
	);
}

render(
	() => (
		<Router>
			<Identity>
				<ModalProvider>
					<App />
				</ModalProvider>
			</Identity>
		</Router>
	),
	root!,
);
