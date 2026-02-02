"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
    />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, onClick, ...props }, ref) => {
    // Note: This is a simplified version. In a real Radix UI setup, context would handle active state.
    // Here we rely on the parent component or a simple context if we wanted to be fully robust.
    // For now, we'll assume the parent controls the state or we use a simple context.

    const context = React.useContext(TabsContext);
    const isActive = context.value === value;

    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "hover:bg-slate-200/50 hover:text-slate-900",
                className
            )}
            onClick={(e) => {
                context.onValueChange(value);
                onClick?.(e);
            }}
            {...props}
        />
    );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (context.value !== value) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 animate-in fade-in-50 zoom-in-95 duration-200",
                className
            )}
            {...props}
        />
    );
});
TabsContent.displayName = "TabsContent";


// Simple Context for state management
const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
}>({ value: "", onValueChange: () => { } });


const TabsRoot = ({ defaultValue, value, onValueChange, children, className, ...props }: React.ComponentProps<typeof Tabs> & { defaultValue?: string, value?: string, onValueChange?: (val: string) => void }) => {
    const [localValue, setLocalValue] = React.useState(defaultValue || "");
    const controlled = value !== undefined;
    const currentValue = controlled ? value : localValue;
    const handleChange = controlled ? onValueChange : setLocalValue;

    return (
        <TabsContext.Provider value={{ value: currentValue!, onValueChange: handleChange! }}>
            <Tabs className={className} {...props} ref={undefined}>
                {children}
            </Tabs>
        </TabsContext.Provider>
    )
}

export { TabsRoot as Tabs, TabsList, TabsTrigger, TabsContent };
