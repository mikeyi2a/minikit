import { ClassValue } from 'clsx';
import * as React from 'react';
import { CSSProperties } from 'react';

declare function cn(...inputs: ClassValue[]): string;
declare function clamp(value: number, min: number, max: number): number;
declare function stepValue(value: number, step: number): number;
declare function formatValue(value: number, step?: number): string;

/** Shared inline tokens used across Minikit default theme */
declare const mk: {
    surface: (alpha?: number) => CSSProperties;
    mono: CSSProperties;
    label: CSSProperties;
    faint: CSSProperties;
};

interface SegmentedControlItem<T extends string = string> {
    value: T;
    label: string;
    disabled?: boolean;
}
interface SegmentedControlProps<T extends string = string> {
    items: SegmentedControlItem<T>[];
    value: T;
    onValueChange: (value: T) => void;
    className?: string;
    size?: "sm" | "md";
}
declare function SegmentedControl<T extends string = string>({ items, value, onValueChange, className, size, }: SegmentedControlProps<T>): React.JSX.Element;

interface SliderProps {
    label?: string;
    hint?: string;
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    tickCount?: number;
    snapToTicks?: boolean;
    className?: string;
    disabled?: boolean;
}
declare function Slider({ label, hint, value, onValueChange, min, max, step, showValue, tickCount, snapToTicks, className, disabled, }: SliderProps): React.JSX.Element;

interface DualSliderProps {
    label?: string;
    value: [number, number];
    onValueChange: (value: [number, number]) => void;
    min?: number;
    max?: number;
    step?: number;
    showValues?: boolean;
    className?: string;
    disabled?: boolean;
}
declare function DualSlider({ label, value: [start, end], onValueChange, min, max, step, showValues, className, disabled, }: DualSliderProps): React.JSX.Element;

interface NumberStepperProps {
    label?: string;
    value: number;
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    disabled?: boolean;
}
declare function NumberStepper({ label, value, onValueChange, min, max, step, className, disabled, }: NumberStepperProps): React.JSX.Element;

interface ColorPickerProps {
    value: string;
    onValueChange: (color: string) => void;
    swatches?: string[];
    showEyedropper?: boolean;
    label?: string;
    className?: string;
}
declare function ColorPicker({ value, onValueChange, swatches, showEyedropper, label, className, }: ColorPickerProps): React.JSX.Element;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "accent" | "muted" | "outline";
    size?: "sm" | "md";
}
declare function Badge({ variant, size, className, children, ...props }: BadgeProps): React.JSX.Element;

interface SidebarProps {
    title?: string;
    side?: "left" | "right";
    width?: number | string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
declare function Sidebar({ title, side, width, collapsible, defaultCollapsed, header, footer, children, className, }: SidebarProps): React.JSX.Element;

interface TooltipProps {
    content: React.ReactNode;
    shortcut?: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    delayDuration?: number;
    className?: string;
}
declare function Tooltip({ content, shortcut, children, side, delayDuration, className, }: TooltipProps): React.JSX.Element;

interface ToggleProps {
    label?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}
declare function Toggle({ label, checked, onCheckedChange, disabled, className }: ToggleProps): React.JSX.Element;

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface SelectProps {
    label?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}
declare function Select({ label, value, onValueChange, options, placeholder, className, disabled, }: SelectProps): React.JSX.Element;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md";
}
declare function Button({ variant, size, className, children, ...props }: ButtonProps): React.JSX.Element;
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    active?: boolean;
    size?: "sm" | "md";
}
declare function IconButton({ label, active, size, className, children, ...props }: IconButtonProps): React.JSX.Element;

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    size?: "sm" | "md";
}
declare function TextInput({ label, size, className, ...props }: TextInputProps): React.JSX.Element;

interface CheckboxProps {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}
declare function Checkbox({ label, checked, onCheckedChange, disabled, className }: CheckboxProps): React.JSX.Element;

interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface RadioGroupProps {
    label?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: RadioOption[];
    orientation?: "horizontal" | "vertical";
    className?: string;
}
declare function RadioGroup({ label, value, onValueChange, options, orientation, className, }: RadioGroupProps): React.JSX.Element;

interface CoordinateInputProps {
    label?: string;
    x: number;
    y: number;
    onChange: (coords: {
        x: number;
        y: number;
    }) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}
declare function CoordinateInput({ label, x, y, onChange, min, max, step, className, }: CoordinateInputProps): React.JSX.Element;

interface PresetItem {
    id: string;
    label: string;
}
interface PresetPickerProps {
    label?: string;
    presets: PresetItem[];
    value?: string;
    onValueChange: (id: string) => void;
    onAdd?: () => void;
    className?: string;
}
declare function PresetPicker({ label, presets, value, onValueChange, onAdd, className, }: PresetPickerProps): React.JSX.Element;

interface FieldGroupProps {
    label?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
    layout?: "stack" | "row";
}
declare function FieldGroup({ label, hint, children, className, layout, }: FieldGroupProps): React.JSX.Element;

type PanelMode = "docked" | "floating";
interface PanelProps {
    title?: string;
    children: React.ReactNode;
    mode?: PanelMode;
    side?: "left" | "right";
    width?: number;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    /** Floating only — initial position */
    defaultPosition?: {
        x: number;
        y: number;
    };
    className?: string;
    footer?: React.ReactNode;
}
declare function Panel({ title, children, mode, side, width, collapsible, defaultCollapsed, defaultPosition, className, footer, }: PanelProps): React.JSX.Element;

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    side?: "left" | "right" | "bottom";
    width?: number;
    children: React.ReactNode;
}
declare function Drawer({ open, onOpenChange, title, side, width, children, }: DrawerProps): React.JSX.Element | null;

interface SplitViewProps {
    left: React.ReactNode;
    right: React.ReactNode;
    defaultRatio?: number;
    minRatio?: number;
    maxRatio?: number;
    className?: string;
    orientation?: "horizontal" | "vertical";
}
declare function SplitView({ left, right, defaultRatio, minRatio, maxRatio, className, orientation, }: SplitViewProps): React.JSX.Element;

interface TabItem {
    value: string;
    label: string;
    content: React.ReactNode;
}
interface TabsProps {
    items: TabItem[];
    defaultValue?: string;
    className?: string;
}
declare function Tabs({ items, defaultValue, className }: TabsProps): React.JSX.Element;

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
}
interface AccordionPanelProps {
    items: AccordionItem[];
    defaultOpen?: string[];
    className?: string;
}
declare function AccordionPanel({ items, defaultOpen, className }: AccordionPanelProps): React.JSX.Element;

interface ToolbarItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    disabled?: boolean;
    active?: boolean;
    onClick?: () => void;
}
interface ToolbarProps {
    items: ToolbarItem[];
    orientation?: "horizontal" | "vertical";
    className?: string;
}
declare function Toolbar({ items, orientation, className }: ToolbarProps): React.JSX.Element;

interface DropzoneProps {
    onFileAccept: (file: File) => void;
    accept?: string;
    maxSize?: number;
    preview?: string | null;
    label?: string;
    hint?: string;
    className?: string;
    disabled?: boolean;
}
declare function Dropzone({ onFileAccept, accept, maxSize, preview, label, hint, className, disabled, }: DropzoneProps): React.JSX.Element;

interface CompareSliderProps {
    beforeSrc: string;
    afterSrc: string;
    beforeLabel?: string;
    afterLabel?: string;
    position?: number;
    onPositionChange?: (position: number) => void;
    className?: string;
    aspectRatio?: string;
}
declare function CompareSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel, position: controlledPosition, onPositionChange, className, aspectRatio, }: CompareSliderProps): React.JSX.Element;

type CanvasBackground = "transparent" | "white" | "custom";
interface CanvasFrameProps {
    children?: React.ReactNode;
    aspectRatio?: number | string;
    zoom?: number;
    onZoomChange?: (zoom: number) => void;
    background?: CanvasBackground;
    backgroundColor?: string;
    label?: string;
    className?: string;
    showZoomControls?: boolean;
}
declare function CanvasFrame({ children, aspectRatio, zoom, onZoomChange, background, backgroundColor, label, className, showZoomControls, }: CanvasFrameProps): React.JSX.Element;

type ExportFormat = "png" | "jpg" | "svg" | "clipboard";
interface ExportButtonProps {
    onExport: (format: ExportFormat) => void | Promise<void>;
    formats?: ExportFormat[];
    className?: string;
    disabled?: boolean;
}
declare function ExportButton({ onExport, formats, className, disabled, }: ExportButtonProps): React.JSX.Element;

interface LayerItem {
    id: string;
    name: string;
    visible?: boolean;
    locked?: boolean;
}
interface LayerListProps {
    layers: LayerItem[];
    activeId?: string;
    onActiveChange?: (id: string) => void;
    onToggleVisible?: (id: string) => void;
    onToggleLocked?: (id: string) => void;
    onReorder?: (fromIndex: number, toIndex: number) => void;
    className?: string;
}
declare function LayerList({ layers, activeId, onActiveChange, onToggleVisible, onToggleLocked, onReorder, className, }: LayerListProps): React.JSX.Element;

interface TimelineKeyframe {
    id: string;
    time: number;
}
interface TimelineShot {
    id: string;
    label: string;
}
interface TimelineProps {
    duration?: number;
    currentTime: number;
    onCurrentTimeChange: (time: number) => void;
    keyframes?: TimelineKeyframe[];
    onKeyframesChange?: (keyframes: TimelineKeyframe[]) => void;
    shots?: TimelineShot[];
    activeShotId?: string;
    onActiveShotChange?: (id: string) => void;
    playing?: boolean;
    onPlayingChange?: (playing: boolean) => void;
    looping?: boolean;
    onLoopingChange?: (looping: boolean) => void;
    onAddShot?: () => void;
    onAddKeyframe?: () => void;
    onClearKeyframes?: () => void;
    onPresets?: () => void;
    onEasing?: () => void;
    showControls?: boolean;
    className?: string;
}
declare function Timeline({ duration, currentTime, onCurrentTimeChange, keyframes, onKeyframesChange, shots, activeShotId, onActiveShotChange, playing, onPlayingChange, looping, onLoopingChange, onAddShot, onAddKeyframe, onClearKeyframes, onPresets, onEasing, showControls, className, }: TimelineProps): React.JSX.Element;

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
}
declare function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps): React.JSX.Element;

interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    width?: number;
}
declare function Popover({ trigger, children, side, align, width }: PopoverProps): React.JSX.Element;
declare function PopoverLabel({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}
declare function EmptyState({ title, description, action, icon, className }: EmptyStateProps): React.JSX.Element;

interface ProgressBarProps {
    value: number;
    label?: string;
    showValue?: boolean;
    className?: string;
    variant?: "default" | "indeterminate";
}
declare function ProgressBar({ value, label, showValue, className, variant, }: ProgressBarProps): React.JSX.Element;

interface StatusBarItem {
    id: string;
    label: string;
    variant?: "default" | "success" | "warning" | "error";
}
interface StatusBarProps {
    items: StatusBarItem[];
    className?: string;
}
declare function StatusBar({ items, className }: StatusBarProps): React.JSX.Element;

interface ToastProps {
    message: string;
    variant?: "default" | "success" | "error";
    visible: boolean;
    onDismiss?: () => void;
    className?: string;
}
declare function Toast({ message, variant, visible, onDismiss, className }: ToastProps): React.JSX.Element | null;

export { AccordionPanel, Badge, Button, CanvasFrame, Checkbox, ColorPicker, CompareSlider, CoordinateInput, Dialog, Drawer, Dropzone, DualSlider, EmptyState, ExportButton, FieldGroup, IconButton, LayerList, NumberStepper, Panel, Popover, PopoverLabel, PresetPicker, ProgressBar, RadioGroup, SegmentedControl, Select, Sidebar, Slider, SplitView, StatusBar, Tabs, TextInput, Timeline, Toast, Toggle, Toolbar, Tooltip, clamp, cn, formatValue, mk, stepValue };
