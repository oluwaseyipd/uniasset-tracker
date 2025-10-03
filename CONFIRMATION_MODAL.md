# Confirmation Modal System

This document explains how to use the confirmation modal system in the UniAsset Tracker application to replace browser prompts with designed confirmation dialogs.

## Overview

The confirmation modal system provides a consistent, user-friendly way to handle destructive actions like deleting assets or departments. It replaces the native browser `confirm()` function with a styled modal dialog.

## Components

### ConfirmationModal

The main modal component that displays the confirmation dialog.

```tsx
import { ConfirmationModal } from "@/components/ConfirmationModal";

<ConfirmationModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Asset"
  description="Are you sure you want to delete this asset? This action cannot be undone."
  onConfirm={handleConfirm}
  confirmText="Delete"
  cancelText="Cancel"
  loading={isLoading}
  type="delete"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Whether the modal is open |
| `onOpenChange` | `(open: boolean) => void` | - | Function called when modal state changes |
| `title` | `string` | - | Title of the confirmation modal |
| `description` | `string` | - | Description/message for the confirmation |
| `onConfirm` | `() => void` | - | Function called when user confirms |
| `confirmText` | `string` | `"Delete"` | Text for the confirm button |
| `cancelText` | `string` | `"Cancel"` | Text for the cancel button |
| `confirmVariant` | `string` | `"destructive"` | Variant for the confirm button |
| `loading` | `boolean` | `false` | Whether the confirm action is loading |
| `type` | `"delete" \| "warning" \| "info"` | `"delete"` | Type of confirmation (affects icon) |

### ConfirmationTrigger

A convenience component that combines a trigger element with the confirmation modal.

```tsx
import { ConfirmationTrigger } from "@/components/ConfirmationModal";

<ConfirmationTrigger
  title="Delete Asset"
  description="Are you sure you want to delete this asset?"
  onConfirm={handleDelete}
  confirmText="Delete Asset"
  type="delete"
>
  <Button variant="destructive" size="sm">
    <Trash2 className="h-4 w-4" />
  </Button>
</ConfirmationTrigger>
```

## Usage Patterns

### Basic Usage (Manual State Management)

```tsx
import { useState } from "react";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function AssetCard({ asset, onDelete }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDelete(asset.id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="asset-card">
      <h3>{asset.name}</h3>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setDeleteModalOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Asset"
        description={`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete Asset"
        loading={deleteLoading}
        type="delete"
      />
    </div>
  );
}
```

### Using the ConfirmationTrigger

```tsx
import { ConfirmationTrigger } from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function QuickDeleteButton({ item, onDelete }) {
  const handleDelete = async () => {
    await onDelete(item.id);
    // Modal will close automatically after successful confirmation
  };

  return (
    <ConfirmationTrigger
      title={`Delete ${item.type}`}
      description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      confirmText={`Delete ${item.type}`}
      type="delete"
    >
      <Button variant="destructive" size="sm">
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmationTrigger>
  );
}
```

### Using the useConfirmation Hook

For more advanced use cases, you can use the `useConfirmation` hook:

```tsx
import { useConfirmation } from "@/hooks/use-confirmation";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/button";

export function AssetList({ assets, onDelete }) {
  const confirmation = useConfirmation();

  const handleDelete = (asset) => {
    confirmation.confirm(
      {
        title: "Delete Asset",
        description: `Are you sure you want to delete "${asset.name}"?`,
        confirmText: "Delete Asset",
        type: "delete",
      },
      async () => {
        await onDelete(asset.id);
        // Handle success (e.g., show toast, refresh data)
      }
    );
  };

  return (
    <div>
      {assets.map((asset) => (
        <div key={asset.id}>
          <h3>{asset.name}</h3>
          <Button onClick={() => handleDelete(asset)}>Delete</Button>
        </div>
      ))}

      <ConfirmationModal
        open={confirmation.isOpen}
        onOpenChange={confirmation.close}
        title={confirmation.options?.title ?? ""}
        description={confirmation.options?.description ?? ""}
        onConfirm={confirmation.handleConfirm}
        confirmText={confirmation.options?.confirmText}
        cancelText={confirmation.options?.cancelText}
        confirmVariant={confirmation.options?.confirmVariant}
        loading={confirmation.loading}
        type={confirmation.options?.type}
      />
    </div>
  );
}
```

## Confirmation Types

### Delete (default)
- **Icon**: Trash2 (red)
- **Button**: Destructive variant
- **Use case**: Deleting items, permanent actions

### Warning
- **Icon**: AlertTriangle (yellow)
- **Button**: Destructive variant
- **Use case**: Potentially dangerous actions

### Info
- **Icon**: AlertTriangle (blue)
- **Button**: Default variant
- **Use case**: Important information confirmations

## Styling

The confirmation modal uses the existing shadcn/ui design system:

- **Colors**: Follows theme colors (destructive, yellow-500, blue-500)
- **Typography**: Consistent with AlertDialog components
- **Spacing**: Standard padding and margins
- **Animation**: Smooth open/close transitions
- **Responsive**: Works well on mobile and desktop

## Best Practices

### 1. Use Descriptive Titles and Messages

**Good:**
```tsx
title="Delete Asset"
description='Are you sure you want to delete "MacBook Pro 2023"? This action cannot be undone.'
```

**Avoid:**
```tsx
title="Confirm"
description="Are you sure?"
```

### 2. Include Item Context

Always include the name or identifier of the item being affected:

```tsx
description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
```

### 3. Handle Loading States

Always show loading states for async operations:

```tsx
const [loading, setLoading] = useState(false);

const handleConfirm = async () => {
  setLoading(true);
  try {
    await deleteItem();
  } finally {
    setLoading(false);
  }
};
```

### 4. Provide Clear Action Buttons

Use descriptive button text:

```tsx
confirmText="Delete Asset"  // Good
confirmText="Yes"          // Avoid
```

### 5. Choose Appropriate Types

- Use `"delete"` for permanent deletions
- Use `"warning"` for potentially dangerous actions
- Use `"info"` for important confirmations that aren't destructive

## Migration from Browser Confirm

### Before (using browser confirm)

```tsx
const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this asset?")) return;

  try {
    await supabase.from("assets").delete().eq("id", id);
    toast({ title: "Success", description: "Asset deleted successfully" });
    fetchData();
  } catch (error: any) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  }
};
```

### After (using ConfirmationModal)

```tsx
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);

const handleDeleteClick = (asset: Asset) => {
  setAssetToDelete(asset);
  setDeleteModalOpen(true);
};

const handleDeleteConfirm = async () => {
  if (!assetToDelete) return;

  setDeleteLoading(true);
  try {
    await supabase.from("assets").delete().eq("id", assetToDelete.id);
    toast({ title: "Success", description: "Asset deleted successfully" });
    fetchData();
    setAssetToDelete(null);
  } catch (error: any) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } finally {
    setDeleteLoading(false);
  }
};

// In JSX:
<Button onClick={() => handleDeleteClick(asset)}>Delete</Button>

<ConfirmationModal
  open={deleteModalOpen}
  onOpenChange={setDeleteModalOpen}
  title="Delete Asset"
  description={assetToDelete ? `Are you sure you want to delete "${assetToDelete.name}"?` : ""}
  onConfirm={handleDeleteConfirm}
  loading={deleteLoading}
/>
```

## Accessibility

The confirmation modal is built on top of Radix UI's AlertDialog, which provides:

- **Keyboard navigation**: Tab, Escape, Enter support
- **Screen reader support**: Proper ARIA labels and descriptions
- **Focus management**: Focus trap within modal
- **Portal rendering**: Renders outside the DOM tree to avoid z-index issues

## Testing

When testing components that use confirmation modals:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

test('shows confirmation modal on delete', async () => {
  render(<AssetCard asset={mockAsset} onDelete={mockDelete} />);
  
  // Click delete button
  fireEvent.click(screen.getByRole('button', { name: /delete/i }));
  
  // Check modal appears
  expect(screen.getByText('Delete Asset')).toBeInTheDocument();
  expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  
  // Confirm deletion
  fireEvent.click(screen.getByRole('button', { name: 'Delete Asset' }));
  
  // Wait for deletion to complete
  await waitFor(() => {
    expect(mockDelete).toHaveBeenCalledWith(mockAsset.id);
  });
});
```

## Troubleshooting

### Modal doesn't appear
- Check that `open` prop is being set to `true`
- Ensure `onOpenChange` handler is properly updating state
- Verify no CSS z-index conflicts

### Modal doesn't close after confirmation
- Make sure `onOpenChange(false)` is called after successful confirmation
- Check that the confirmation handler doesn't throw unhandled errors

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that shadcn/ui components are installed
- Verify theme colors are defined

### TypeScript errors
- Import types from the correct paths
- Ensure all required props are provided
- Check that event handlers have correct signatures