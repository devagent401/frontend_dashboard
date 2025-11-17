// "use client";

// import * as React from "react";
// import { useForm, Controller, FieldValues, Path } from "react-hook-form";
// import { cn } from "@/lib/utils";
// import { Button } from "./button";
// import { Input } from "./input";
// import { Textarea } from "./Textarea";
// import { Switch } from "./switch";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuCheckboxItem
// } from "./dropdown-menu";
// import { Label } from "./Label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
// import { Badge } from "./badge";
// import { Separator } from "./separator";
// import { ChevronDown, X, AlertCircle, Save } from "lucide-react";
// import { DynamicFormConfig, FormField } from "../forms/DynamicForm.type";


// // Dynamic form component
// export function DynamicForm<T extends FieldValues>({
//   fields,
//   onSubmit,
//   onCancel,
//   submitText = "Submit",
//   cancelText = "Cancel",
//   className,
//   layout = "vertical",
//   columns = 1,
//   showValidation = true,
//   loading = false,
// }: DynamicFormConfig) {
//   const form = useForm<T>({
//     mode: showValidation ? "onChange" : "onSubmit",
//   });

//   const { handleSubmit, control, formState: { errors, isSubmitting }, reset } = form;

//   const onSubmitHandler = async (data: T) => {
//     try {
//       await onSubmit(data);
//       reset();
//     } catch (error) {
//       console.error("Form submission error:", error);
//     }
//   };

//   const renderField = (field: FormField, index: number) => {
//     const error = errors[field.name as Path<T>];
//     const hasError = !!error;

//     // Section field
//     if (field.type === "section") {
//       return (
//         <Card key={field.name} className={cn("w-full", field.className)}>
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold">{field.label}</CardTitle>
//             {field.description && (
//               <CardDescription>{field.description}</CardDescription>
//             )}
//           </CardHeader>
//           <CardContent>
//             <div className={cn(
//               "space-y-4",
//               layout === "grid" && `grid grid-cols-${columns} gap-4`
//             )}>
//               {field.children.map((childField: FormField, childIndex: number) =>
//                 renderField(childField, childIndex)
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       );
//     }

//     // Tabs field
//     if (field.type === "tabs") {
//       return (
//         <div key={field.name} className={cn("w-full", field.className)}>
//           {field.label && (
//             <Label className="text-sm font-medium mb-2 block">{field.label}</Label>
//           )}
//           <Tabs defaultValue={field.tabs[0]?.id} className="w-full">
//             <TabsList className="grid w-full grid-cols-3">
//               {field.tabs.map((tab: { id: string; label: string; fields: FormField[]; }) => (
//                 <TabsTrigger key={tab.id} value={tab.id}>
//                   {tab.label}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//             {field.tabs.map((tab: { id: string; label: string; fields: FormField[]; }) => (
//               <TabsContent key={tab.id} value={tab.id} className="mt-4">
//                 <div className={cn(
//                   "space-y-4",
//                   layout === "grid" && `grid grid-cols-${columns} gap-4`
//                 )}>
//                   {tab.fields.map((tabField: FormField, tabIndex: number) =>
//                     renderField(tabField, tabIndex)
//                   )}
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       );
//     }

//     // Regular field wrapper
//     const fieldWrapper = (
//       <div key={field.name} className={cn(
//         "space-y-2",
//         layout === "horizontal" && "flex items-center space-x-4",
//         layout === "grid" && `col-span-1`,
//         field.className
//       )}>
//         {field.label && (
//           <Label className={cn(
//             "text-sm font-medium",
//             layout === "horizontal" && "min-w-[120px] flex-shrink-0"
//           )}>
//             {field.label}
//             {field.required && <span className="text-red-500 ml-1">*</span>}
//           </Label>
//         )}

//         <div className={cn(
//           "flex-1",
//           layout === "horizontal" && "flex-1"
//         )}>
//           {renderFieldInput(field, control, hasError)}

//           {field.description && (
//             <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
//           )}

//           {showValidation && hasError && (
//             <div className="flex items-center space-x-1 mt-1 text-red-500">
//               <AlertCircle className="h-3 w-3" />
//               <span className="text-xs">{error?.message as string}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     );

//     return fieldWrapper;
//   };

//   const renderFieldInput = (field: FormField, control: any, hasError: boolean) => {
//     const errorClasses = hasError ? "border-red-500 focus-visible:ring-red-500" : "";

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "password":
//       case "tel":
//       case "url":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <Input
//                 type={field.type}
//                 placeholder={field.placeholder}
//                 value={value || field.defaultValue || ""}
//                 onChange={onChange}
//                 disabled={field.disabled}
//                 className={cn(errorClasses)}
//                 {...fieldProps}
//               />
//             )}
//           />
//         );

//       case "number":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <Input
//                 type="number"
//                 placeholder={field.placeholder}
//                 value={value ?? field.defaultValue ?? ""}
//                 onChange={onChange}
//                 disabled={field.disabled}
//                 min={field.min}
//                 max={field.max}
//                 step={field.step}
//                 className={cn(errorClasses)}
//                 {...fieldProps}
//               />
//             )}
//           />
//         );

//       case "textarea":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <Textarea
//                 placeholder={field.placeholder}
//                 value={value || field.defaultValue || ""}
//                 onChange={onChange}
//                 disabled={field.disabled}
//                 rows={field.rows || 3}
//                 className={cn(errorClasses)}
//                 {...fieldProps}
//               />
//             )}
//           />
//         );

//       case "select":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn(
//                       "w-full justify-between",
//                       errorClasses,
//                       !value && "text-muted-foreground"
//                     )}
//                     disabled={field.disabled}
//                     {...fieldProps}
//                   >
//                     {value ?
//                       field.options.find((opt: { value: any; label: string }) => opt.value === value)?.label || "Select option" :
//                       field.placeholder || "Select option"
//                     }
//                     <ChevronDown className="h-4 w-4 opacity-50" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-full min-w-[200px]">
//                   {field.options.map((option: { value: any; disabled: any; label: any; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
//                     <DropdownMenuItem
//                       key={option.value}
//                       onClick={() => onChange(option.value)}
//                       disabled={option.disabled}
//                       className="cursor-pointer"
//                     >
//                       {option.label}
//                       {option.description && (
//                         <span className="text-xs text-muted-foreground ml-2">
//                           {option.description}
//                         </span>
//                       )}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           />
//         );

//       case "multiselect":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => {
//               const selectedValues = value || field.defaultValue || [];
//               const selectedOptions = field.options.filter((opt: { value: any; }) =>
//                 selectedValues.includes(opt.value)
//               );

//               return (
//                 <div className="space-y-2">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-between",
//                           errorClasses,
//                           selectedValues.length === 0 && "text-muted-foreground"
//                         )}
//                         disabled={field.disabled}
//                         {...fieldProps}
//                       >
//                         {selectedValues.length > 0 ?
//                           `${selectedValues.length} selected` :
//                           field.placeholder || "Select options"
//                         }
//                         <ChevronDown className="h-4 w-4 opacity-50" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-full min-w-[200px]">
//                       {field.options.map((option: { value: any; disabled: any; label: any; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
//                         <DropdownMenuCheckboxItem
//                           key={option.value}
//                           checked={selectedValues.includes(option.value)}
//                           onCheckedChange={(checked: unknown) => {
//                             if (checked) {
//                               onChange([...selectedValues, option.value]);
//                             } else {
//                               onChange(selectedValues.filter((v: any) => v !== option.value));
//                             }
//                           }}
//                           disabled={option.disabled}
//                         >
//                           {option.label}
//                         </DropdownMenuCheckboxItem>
//                       ))}
//                     </DropdownMenuContent>
//                   </DropdownMenu>

//                   {selectedOptions.length > 0 && (
//                     <div className="flex flex-wrap gap-1">
//                       {selectedOptions.map((option: { value: any; disabled: any; label: any; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
//                         <Badge
//                           key={option.value}
//                           variant="secondary"
//                           className="flex items-center space-x-1"
//                         >
//                           <span>{option.label}</span>
//                           <button
//                             type="button"
//                             onClick={() => onChange(selectedValues.filter((v: unknown) => v !== option.value))}
//                             className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             }}
//           />
//         );

//       case "radio":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <div className={cn(
//                 "space-y-2",
//                 field.inline && "flex flex-wrap gap-4"
//               )}>
//                 {field.options.map((option: { value: any; disabled: any; label: any; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
//                   <div
//                     key={option.value}
//                     className={cn(
//                       "flex items-center space-x-2",
//                       field.inline && "flex-shrink-0"
//                     )}
//                   >
//                     <input
//                       type="radio"
//                       id={`${field.name}-${option.value}`}
//                       value={option.value}
//                       checked={value === option.value}
//                       onChange={(e) => onChange(e.target.value)}
//                       disabled={field.disabled || option.disabled}
//                       className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
//                       {...fieldProps}
//                     />
//                     <Label
//                       htmlFor={`${field.name}-${option.value}`}
//                       className="text-sm font-normal cursor-pointer"
//                     >
//                       {option.label}
//                       {option.description && (
//                         <span className="text-xs text-muted-foreground ml-2">
//                           {option.description}
//                         </span>
//                       )}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           />
//         );

//       case "checkbox":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <div className={cn(
//                 "space-y-2",
//                 field.inline && "flex flex-wrap gap-4"
//               )}>
//                 {field.options.map((option: { value: any; disabled: any; label: any; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
//                   <div
//                     key={option.value}
//                     className={cn(
//                       "flex items-center space-x-2",
//                       field.inline && "flex-shrink-0"
//                     )}
//                   >
//                     <input
//                       type="checkbox"
//                       id={`${field.name}-${option.value}`}
//                       value={option.value}
//                       checked={value?.includes(option.value) || false}
//                       onChange={(e) => {
//                         const currentValues = value || [];
//                         if (e.target.checked) {
//                           onChange([...currentValues, option.value]);
//                         } else {
//                           onChange(currentValues.filter((v: unknown) => v !== option.value));
//                         }
//                       }}
//                       disabled={field.disabled || option.disabled}
//                       className="h-4 w-4 text-primary border-gray-300 focus:ring-primary rounded"
//                       {...fieldProps}
//                     />
//                     <Label
//                       htmlFor={`${field.name}-${option.value}`}
//                       className="text-sm font-normal cursor-pointer"
//                     >
//                       {option.label}
//                       {option.description && (
//                         <span className="text-xs text-muted-foreground ml-2">
//                           {option.description}
//                         </span>
//                       )}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           />
//         );

//       case "switch":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <Switch
//                 checked={value ?? field.defaultValue ?? false}
//                 onCheckedChange={onChange}
//                 disabled={field.disabled}
//                 {...fieldProps}
//               />
//             )}
//           />
//         );

//       case "date":
//       case "time":
//       case "datetime-local":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <Input
//                 type={field.type}
//                 value={value || field.defaultValue || ""}
//                 onChange={onChange}
//                 disabled={field.disabled}
//                 min={field.min}
//                 max={field.max}
//                 className={cn(errorClasses)}
//                 {...fieldProps}
//               />
//             )}
//           />
//         );

//       case "file":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <div className="space-y-2">
//                 <Input
//                   type="file"
//                   onChange={(e) => {
//                     const files = e.target.files;
//                     if (field.multiple) {
//                       onChange(Array.from(files || []));
//                     } else {
//                       onChange(files?.[0] || null);
//                     }
//                   }}
//                   disabled={field.disabled}
//                   accept={field.accept}
//                   multiple={field.multiple}
//                   className={cn(errorClasses)}
//                   {...fieldProps}
//                 />
//                 {field.maxSize && (
//                   <p className="text-xs text-muted-foreground">
//                     Max file size: {field.maxSize}MB
//                   </p>
//                 )}
//               </div>
//             )}
//           />
//         );

//       case "range":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <div className="space-y-2">
//                 <input
//                   type="range"
//                   min={field.min || 0}
//                   max={field.max || 100}
//                   step={field.step || 1}
//                   value={value ?? field.defaultValue ?? 0}
//                   onChange={(e) => onChange(Number(e.target.value))}
//                   disabled={field.disabled}
//                   className={cn(
//                     "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
//                     errorClasses
//                   )}
//                   {...fieldProps}
//                 />
//                 <div className="flex justify-between text-xs text-muted-foreground">
//                   <span>{field.min || 0}</span>
//                   <span className="font-medium">{value ?? field.defaultValue ?? 0}</span>
//                   <span>{field.max || 100}</span>
//                 </div>
//               </div>
//             )}
//           />
//         );

//       case "color":
//         return (
//           <Controller
//             name={field.name as Path<T>}
//             control={control}
//             rules={{ required: field.required }}
//             render={({ field: { onChange, value, ...fieldProps } }) => (
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="color"
//                   value={value || field.defaultValue || "#000000"}
//                   onChange={(e) => onChange(e.target.value)}
//                   disabled={field.disabled}
//                   className={cn(
//                     "h-10 w-20 rounded border border-input cursor-pointer",
//                     errorClasses
//                   )}
//                   {...fieldProps}
//                 />
//                 <Input
//                   value={value || field.defaultValue || "#000000"}
//                   onChange={(e) => onChange(e.target.value)}
//                   disabled={field.disabled}
//                   className={cn("flex-1", errorClasses)}
//                   placeholder="#000000"
//                 />
//               </div>
//             )}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmitHandler)} className={cn("space-y-6", className)}>
//       <div className={cn(
//         "space-y-6",
//         layout === "grid" && `grid grid-cols-${columns} gap-6`,
//         layout === "horizontal" && "space-y-4"
//       )}>
//         {fields.map((field: FormField, index: number) => renderField(field, index))}
//       </div>

//       <Separator />

//       <div className="flex items-center justify-end space-x-3">
//         {onCancel && (
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onCancel}
//             disabled={loading || isSubmitting}
//           >
//             {cancelText}
//           </Button>
//         )}
//         <Button
//           type="submit"
//           disabled={loading || isSubmitting}
//           className="min-w-[120px]"
//         >
//           {loading || isSubmitting ? (
//             <div className="flex items-center space-x-2">
//               <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//               <span>Loading...</span>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-2">
//               <Save className="h-4 w-4" />
//               <span>{submitText}</span>
//             </div>
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// }

// // Hook for using the dynamic form
// export function useDynamicForm<T extends FieldValues>() {
//   return useForm<T>();
// }

