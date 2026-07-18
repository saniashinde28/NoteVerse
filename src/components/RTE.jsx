import React from "react";
import { lazy, Suspense } from "react";

const Editor = lazy(() =>
    import("@tinymce/tinymce-react").then((module) => ({
        default: module.Editor,
    }))
);
import { Controller } from "react-hook-form";

//control passess control from this component to the one where it is called
export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className="w-full">
            {label && <label className="inline-block mb-1 pl-1">{label}</label>}


            {/* This tells React Hook Form:

“I have a field named content, but it is not a normal input. Please manage it through Controller */}
            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => {
                    return (
                        <Suspense fallback={<div>Loading editor...</div>}>
                            <Editor
                                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                initialValue={defaultValue}
                                init={{
                                    initialValue: defaultValue,
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        "image",
                                        "advlist",
                                        "autolink",
                                        "lists",
                                        "link",
                                        "image",
                                        "charmap",
                                        "preview",
                                        "anchor",
                                        "searchreplace",
                                        "visualblocks",
                                        "code",
                                        "fullscreen",
                                        "insertdatetime",
                                        "media",
                                        "table",
                                        "code",
                                        "help",
                                        "wordcount",
                                        "anchor",
                                    ],
                                    toolbar:
                                        "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                                    content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                }}
                                onEditorChange={onChange}
                            />
                        </Suspense>
                    );
                }} />
        </div>

    )
}