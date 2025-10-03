import { useState } from "react";

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "warning" | "info";
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export interface UseConfirmationReturn {
  /** Whether the confirmation modal is open */
  isOpen: boolean;
  /** Whether the action is currently being performed */
  loading: boolean;
  /** Function to show the confirmation modal */
  confirm: (options: ConfirmationOptions, action: () => Promise<void>) => void;
  /** Function to hide the confirmation modal */
  close: () => void;
  /** Current confirmation options */
  options: ConfirmationOptions | null;
}

/**
 * Custom hook for handling confirmation modals
 *
 * @example
 * ```tsx
 * const confirmation = useConfirmation();
 *
 * const handleDelete = () => {
 *   confirmation.confirm(
 *     {
 *       title: "Delete Item",
 *       description: "Are you sure you want to delete this item?",
 *       confirmText: "Delete",
 *       type: "delete"
 *     },
 *     async () => {
 *       await deleteItem(id);
 *       // Item deleted successfully
 *     }
 *   );
 * };
 *
 * return (
 *   <div>
 *     <button onClick={handleDelete}>Delete</button>
 *     <ConfirmationModal
 *       open={confirmation.isOpen}
 *       onOpenChange={confirmation.close}
 *       title={confirmation.options?.title ?? ""}
 *       description={confirmation.options?.description ?? ""}
 *       onConfirm={confirmation.handleConfirm}
 *       confirmText={confirmation.options?.confirmText}
 *       cancelText={confirmation.options?.cancelText}
 *       confirmVariant={confirmation.options?.confirmVariant}
 *       loading={confirmation.loading}
 *       type={confirmation.options?.type}
 *     />
 *   </div>
 * );
 * ```
 */
export function useConfirmation(): UseConfirmationReturn & {
  handleConfirm: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [action, setAction] = useState<(() => Promise<void>) | null>(null);

  const confirm = (
    confirmationOptions: ConfirmationOptions,
    confirmationAction: () => Promise<void>
  ) => {
    setOptions(confirmationOptions);
    setAction(() => confirmationAction);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setLoading(false);
    setOptions(null);
    setAction(null);
  };

  const handleConfirm = async () => {
    if (!action) return;

    setLoading(true);
    try {
      await action();
      close();
    } catch (error) {
      // Error handling should be done in the action itself
      // This hook doesn't handle errors to maintain separation of concerns
      setLoading(false);
    }
  };

  return {
    isOpen,
    loading,
    options,
    confirm,
    close,
    handleConfirm,
  };
}
