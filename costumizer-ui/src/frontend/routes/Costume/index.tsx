import { fetchCostumeExistence, fetchCostumeInfo } from "../../utils/api/costume";
import { Match, Show, Switch, createResource, createSignal } from "solid-js";
import LoadingButton from "../../components/LoadingButton";
import SkinPreview from "../../components/SkinPreview";
import { useParams } from "@solidjs/router";
import styles from "./styles.module.scss";
import NotFound from "../system/NotFound";
import Input from "../../components/Input";
import Form from "../../utils/Form";
import RadioButton from "../../components/RadioButton";
import SkinBrowser from "./SkinBrowser";

export default function Costume() {
	const [info, { refetch }] = createResource(() => useParams().name, fetchCostumeInfo);
	const [newSlim, setNewSlim] = createSignal<boolean>();
	const [newSkin, setNewSkin] = createSignal<string>();
	const [loading, setLoading] = createSignal(false);
	const form = new Form();

	const validators = [
		{
			pattern: /^[a-zA-Z0-9_]*$/,
			message: "Field must contain only alphanumeric characters and underscores.",
		},
	];

	const options = [
		{ label: "Classic", value: false },
		{ label: "Slim", value: true },
	];

	async function validateNameUnique(value: string) {
		if (info()!.data!.name == value) return;
		setLoading(true);
		const response = await fetchCostumeExistence(value);
		setLoading(false);
		if (!response.data!.exists) return;
		return "There is already a costume registered with this name.";
	}

	return (
		<Show when={!info.loading && info()}>
			<Switch>
				<Match when={info()!.status == 404}>
					<NotFound />
				</Match>
				<Match when={info()!.status == 200}>
					<h1>{info()!.data!.name}</h1>
					<hr />
					<div class={styles.grid}>
						<div class={styles.preview}>
							<SkinPreview
								slim={newSlim() ?? info()!.data!.skin.slim}
								src={newSkin() ?? info()!.data!.skin.url}
							/>
						</div>
						<div class={styles.form}>
							<div class={styles.field}>
								<label class="smallcaps">Name</label>
								<Input
									required
									form={form}
									name="name"
									maxlength="32"
									class={styles.input}
									validators={validators}
									value={info()!.data?.name}
									validator={validateNameUnique}
								/>
							</div>
							<div class={styles.field}>
								<label class="smallcaps">Display Name</label>
								<Input
									required
									form={form}
									minlength="3"
									name="display"
									maxlength="16"
									class={styles.input}
									validators={validators}
									value={info()!.data?.display}
								/>
							</div>
							<div class={styles.field}>
								<label class="smallcaps">Player Model</label>
								<RadioButton
									form={form}
									name="model"
									options={options}
									onChange={setNewSlim}
									value={info()!.data!.skin.slim}
								/>
							</div>
							<div class={styles.field}>
								<label class="smallcaps">Skin File</label>
								<SkinBrowser onChange={setNewSkin} />
							</div>
							<div class={styles.controls}>
								<button class="danger">Delete</button>
								<LoadingButton
									class="green"
									loading={loading()}
									disabled={!form.valid()}
								>
									Save
								</LoadingButton>
							</div>
						</div>
					</div>
				</Match>
			</Switch>
		</Show>
	);
}
