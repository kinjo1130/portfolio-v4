/*
ここには、ロジックとvalidation関係を書くようにする
*/
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import type { FormValues } from "./presenter";
import FormPresenter from "./presenter";

// validationのschemaの作成
const schema = z.object({
	name: z.string().nonempty(),
	email: z.string().email(),
	age: z.number().int().positive(),
});

const FormContainer = () => {
	// ここにロジックを書いていく
	const { control, handleSubmit } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			age: 0,
		},
	});
	const onSubmit: SubmitHandler<FormValues> = (data) => {
		console.log(data);
	};
	// UIはここにimportしてきているだけ
	return <FormPresenter control={control} onSubmit={handleSubmit(onSubmit)} />;
};

export default FormContainer;