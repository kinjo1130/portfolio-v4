import { Button } from "@/components/Button";
import {
	type Control,
	Controller,
	type UseFormHandleSubmit,
} from "react-hook-form";

export type FormValues = {
	name: string;
	email: string;
	age: number;
};

type Props = {
	control: Control<FormValues>;
	onSubmit: ReturnType<UseFormHandleSubmit<FormValues>>;
};

const FormPresenter: React.FC<Props> = ({ control, onSubmit }) => {
	if(!control) return null;
	return (
		<form onSubmit={onSubmit} className="m-24">
			<div>
				<label htmlFor="name">名前</label>
				<Controller
					name="name"
					control={control}
					render={({ field, fieldState }) => (
						<div>
							<input type="text" {...field} className="border" />
							{fieldState.error && <span>{fieldState.error.message}</span>}
						</div>
					)}
				/>
			</div>

			<div>
				<label htmlFor="email">メールアドレス</label>
				<Controller
					name="email"
					control={control}
					render={({ field, fieldState }) => (
						<div>
							<input type="email" {...field} className="border" />
							{fieldState.error && <span>{fieldState.error.message}</span>}
						</div>
					)}
				/>
			</div>

			<div>
				<label htmlFor="age">年齢</label>
				<Controller
					name="age"
					control={control}
					render={({ field, fieldState }) => (
						<div>
							<input id="age" type="number" {...field} />
							{fieldState.error && <span>{fieldState.error.message}</span>}
						</div>
					)}
				/>
			</div>

			<Button type="submit">送信</Button>
		</form>
	);
};

export default FormPresenter;
