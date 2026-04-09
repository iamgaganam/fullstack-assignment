import { Trash } from "@phosphor-icons/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  isDark: boolean;
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  isDark,
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const heading = isDark ? "text-white" : "text-slate-900";
  const body = isDark ? "text-slate-400" : "text-slate-600";

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent
        className={`overflow-hidden rounded-[28px] p-0 shadow-2xl sm:max-w-[28rem] ${
          isDark
            ? "border-white/10 bg-slate-950 text-white"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        <AlertDialogHeader
          className={`px-6 py-6 text-center ${
            isDark ? "border-white/10" : "border-slate-100"
          }`}
        >
          <div
            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${
              isDark
                ? "bg-red-500/10 ring-1 ring-red-500/15"
                : "bg-red-50 ring-1 ring-red-100"
            }`}
          >
            <Trash size={20} className="text-red-500" weight="fill" />
          </div>
          <AlertDialogTitle
            className={`text-center text-xl font-bold tracking-tight ${heading}`}
          >
            Delete item?
          </AlertDialogTitle>
          <AlertDialogDescription
            className={`mx-auto max-w-sm text-center text-sm leading-7 ${body}`}
          >
            This will permanently remove{" "}
            <span className={`font-semibold ${heading}`}>{itemName}</span>. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter
          className={`gap-2.5 p-5 ${isDark ? "border-white/10" : "border-slate-100"}`}
        >
          <AlertDialogCancel
            className={`h-10 flex-1 rounded-full px-5 text-sm font-medium ${
              isDark
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-10 flex-1 rounded-full border-0 bg-red-600 px-5 text-sm font-medium text-white shadow-md shadow-red-500/20 hover:bg-red-700"
          >
            Delete item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
