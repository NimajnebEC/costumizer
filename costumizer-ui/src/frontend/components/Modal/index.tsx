import { Portal, Show } from "solid-js/web";
import styles from "./styles.module.scss";
import { createContext, useContext, JSX, createSignal, Setter, Accessor } from "solid-js";

export type ModalFactory = () => JSX.Element;

function makeModalContext(stack?: {
	stack: Accessor<ModalFactory[]>;
	setStack: Setter<ModalFactory[]>;
}) {
	return {
		open(content: ModalFactory) {
			if (!stack) throw new Error("Context not found.");
			stack.setStack([content, ...stack.stack()]);
		},
		close() {
			if (!stack) throw new Error("Context not found.");
			const newArr = [...stack.stack()];
			newArr.shift();
			stack.setStack(newArr);
		},
	};
}

const ModalContext = createContext(makeModalContext());

export function ModalProvider(props: { children: any }) {
	const [stack, setStack] = createSignal<ModalFactory[]>(new Array());

	return (
		<ModalContext.Provider value={makeModalContext({ stack, setStack })}>
			<Show when={stack().length}>
				<Portal>
					<div class={styles.blur} />
					<div class={styles.positioner}>
						<div>{stack()[0]()}</div>
					</div>
				</Portal>
			</Show>
			{props.children}
		</ModalContext.Provider>
	);
}

export function useModal() {
	return useContext(ModalContext);
}
