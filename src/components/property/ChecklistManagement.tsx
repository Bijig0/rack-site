"use client";

import { useState, useTransition, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  getPropertyChecklists,
  createChecklistGroup,
  updateChecklistGroup,
  deleteChecklistGroup,
  createChecklistItem,
  updateChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  type ChecklistGroupData,
  type ChecklistItemData,
} from "@/actions/checklist";

interface ChecklistManagementProps {
  propertyId: string;
  initialGroups?: ChecklistGroupData[];
}

const VALUE_TYPES = [
  { value: "text", label: "Text", icon: "fa-font", description: "Free-form text" },
  { value: "number", label: "Number", icon: "fa-hashtag", description: "Numeric value" },
  { value: "boolean", label: "Yes/No", icon: "fa-toggle-on", description: "Yes or No" },
  { value: "date", label: "Date", icon: "fa-calendar", description: "Date picker" },
] as const;

type ValueType = "text" | "number" | "boolean" | "date";

// Track changes per item: { itemId: { value?: string, name?: string, valueType?: ValueType } }
type PendingChanges = Record<string, { value?: string; name?: string; valueType?: ValueType }>;

export default function ChecklistManagement({
  propertyId,
  initialGroups = [],
}: ChecklistManagementProps) {
  const [groups, setGroups] = useState<ChecklistGroupData[]>(initialGroups);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(
    initialGroups[0]?.id || null
  );
  const [, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  // Track pending changes for items
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  // New group modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const groupInputRef = useRef<HTMLInputElement>(null);

  // New item modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemValueType, setNewItemValueType] = useState<ValueType>("text");
  const itemInputRef = useRef<HTMLInputElement>(null);

  // Edit item modal
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItemData | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemValueType, setEditItemValueType] = useState<ValueType>("text");
  const editItemInputRef = useRef<HTMLInputElement>(null);

  // Edit group
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");

  // Calculate stats
  const stats = {
    total: groups.reduce((acc, g) => acc + g.items.length, 0),
    completed: groups.reduce(
      (acc, g) => acc + g.items.filter((i) => i.isCompleted).length,
      0
    ),
    pending: 0,
  };
  stats.pending = stats.total - stats.completed;

  // Check if there are pending changes
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  // Refresh data
  const refreshData = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await getPropertyChecklists(propertyId);
        setGroups(data);
        if (data.length > 0 && !activeGroupId) {
          setActiveGroupId(data[0].id);
        }
      } catch {
        toast.error("Failed to load checklists");
      }
    });
  }, [propertyId, activeGroupId]);

  useEffect(() => {
    if (initialGroups.length === 0) {
      refreshData();
    }
  }, [initialGroups.length, refreshData]);

  // Focus input when modals open
  useEffect(() => {
    if (showGroupModal && groupInputRef.current) {
      setTimeout(() => groupInputRef.current?.focus(), 100);
    }
  }, [showGroupModal]);

  useEffect(() => {
    if (showItemModal && itemInputRef.current) {
      setTimeout(() => itemInputRef.current?.focus(), 100);
    }
  }, [showItemModal]);

  useEffect(() => {
    if (showEditItemModal && editItemInputRef.current) {
      setTimeout(() => editItemInputRef.current?.focus(), 100);
    }
  }, [showEditItemModal]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showGroupModal) handleCloseGroupModal();
        if (showItemModal) handleCloseItemModal();
        if (showEditItemModal) handleCloseEditItemModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showGroupModal, showItemModal, showEditItemModal]);

  const handleCloseGroupModal = () => {
    setShowGroupModal(false);
    setNewGroupName("");
  };

  const handleCloseItemModal = () => {
    setShowItemModal(false);
    setNewItemName("");
    setNewItemValueType("text");
  };

  const handleCloseEditItemModal = () => {
    setShowEditItemModal(false);
    setEditingItem(null);
    setEditItemName("");
    setEditItemValueType("text");
  };

  const handleOpenEditItemModal = (item: ChecklistItemData) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemValueType(item.valueType);
    setShowEditItemModal(true);
  };

  // Optimistic create group
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticGroup: ChecklistGroupData = {
      id: tempId,
      propertyId,
      name: newGroupName.trim(),
      sortOrder: groups.length,
      items: [],
    };

    setGroups((prev) => [...prev, optimisticGroup]);
    setActiveGroupId(tempId);
    handleCloseGroupModal();

    startTransition(async () => {
      const result = await createChecklistGroup(propertyId, newGroupName.trim());
      if (result.success && result.groupId) {
        setGroups((prev) =>
          prev.map((g) => (g.id === tempId ? { ...g, id: result.groupId! } : g))
        );
        setActiveGroupId(result.groupId);
        toast.success("Checklist group created");
      } else {
        setGroups((prev) => prev.filter((g) => g.id !== tempId));
        toast.error(result.error || "Failed to create group");
      }
    });
  };

  // Update group
  const handleUpdateGroup = (groupId: string) => {
    if (!editGroupName.trim()) return;

    const oldName = groups.find((g) => g.id === groupId)?.name;

    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: editGroupName.trim() } : g))
    );
    setEditingGroupId(null);
    setEditGroupName("");

    startTransition(async () => {
      const result = await updateChecklistGroup(groupId, editGroupName.trim());
      if (result.success) {
        toast.success("Group renamed");
      } else {
        setGroups((prev) =>
          prev.map((g) => (g.id === groupId ? { ...g, name: oldName || "" } : g))
        );
        toast.error(result.error || "Failed to rename group");
      }
    });
  };

  // Delete group
  const handleDeleteGroup = (groupId: string) => {
    if (!confirm("Delete this checklist group and all its items?")) return;

    const deletedGroup = groups.find((g) => g.id === groupId);

    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (activeGroupId === groupId) {
      setActiveGroupId(groups.find((g) => g.id !== groupId)?.id || null);
    }

    startTransition(async () => {
      const result = await deleteChecklistGroup(groupId);
      if (result.success) {
        toast.success("Group deleted");
      } else {
        if (deletedGroup) {
          setGroups((prev) => [...prev, deletedGroup]);
        }
        toast.error(result.error || "Failed to delete group");
      }
    });
  };

  // Optimistic create item
  const handleCreateItem = () => {
    if (!newItemName.trim() || !activeGroupId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticItem: ChecklistItemData = {
      id: tempId,
      groupId: activeGroupId,
      name: newItemName.trim(),
      valueType: newItemValueType,
      value: null,
      isCompleted: false,
      sortOrder: groups.find((g) => g.id === activeGroupId)?.items.length || 0,
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId ? { ...g, items: [...g.items, optimisticItem] } : g
      )
    );
    handleCloseItemModal();

    startTransition(async () => {
      const result = await createChecklistItem(activeGroupId, newItemName.trim(), newItemValueType);
      if (result.success && result.itemId) {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === activeGroupId
              ? {
                  ...g,
                  items: g.items.map((i) =>
                    i.id === tempId ? { ...i, id: result.itemId! } : i
                  ),
                }
              : g
          )
        );
        toast.success("Item added");
      } else {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === activeGroupId
              ? { ...g, items: g.items.filter((i) => i.id !== tempId) }
              : g
          )
        );
        toast.error(result.error || "Failed to add item");
      }
    });
  };

  // Update item (name and/or valueType)
  const handleUpdateItemDetails = () => {
    if (!editingItem || !editItemName.trim()) return;

    const oldItem = editingItem;
    const hasNameChange = editItemName.trim() !== oldItem.name;
    const hasTypeChange = editItemValueType !== oldItem.valueType;

    if (!hasNameChange && !hasTypeChange) {
      handleCloseEditItemModal();
      return;
    }

    // Optimistically update UI
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((i) =>
          i.id === oldItem.id
            ? {
                ...i,
                name: editItemName.trim(),
                valueType: editItemValueType,
                // Clear value if type changed
                value: hasTypeChange ? null : i.value,
              }
            : i
        ),
      }))
    );

    // Clear any pending value changes for this item if type changed
    if (hasTypeChange) {
      setPendingChanges((prev) => {
        const { [oldItem.id]: _, ...rest } = prev;
        return rest;
      });
    }

    handleCloseEditItemModal();

    startTransition(async () => {
      const updates: { name?: string; valueType?: ValueType; value?: string | null } = {};
      if (hasNameChange) updates.name = editItemName.trim();
      if (hasTypeChange) {
        updates.valueType = editItemValueType;
        updates.value = null;
      }

      const result = await updateChecklistItem(oldItem.id, updates);
      if (result.success) {
        toast.success("Item updated");
      } else {
        // Rollback
        setGroups((prev) =>
          prev.map((g) => ({
            ...g,
            items: g.items.map((i) =>
              i.id === oldItem.id ? oldItem : i
            ),
          }))
        );
        toast.error(result.error || "Failed to update item");
      }
    });
  };

  // Optimistic toggle item
  const handleToggleItem = (itemId: string) => {
    const groupWithItem = groups.find((g) => g.items.some((i) => i.id === itemId));
    const item = groupWithItem?.items.find((i) => i.id === itemId);
    if (!item) return;

    const newValue = !item.isCompleted;

    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((i) =>
          i.id === itemId ? { ...i, isCompleted: newValue } : i
        ),
      }))
    );

    startTransition(async () => {
      const result = await toggleChecklistItem(itemId);
      if (result.success) {
        toast.success(newValue ? "Item completed" : "Item unchecked");
      } else {
        setGroups((prev) =>
          prev.map((g) => ({
            ...g,
            items: g.items.map((i) =>
              i.id === itemId ? { ...i, isCompleted: !newValue } : i
            ),
          }))
        );
        toast.error("Failed to update item");
      }
    });
  };

  // Track value changes locally (doesn't save immediately)
  const handleValueChange = (itemId: string, value: string) => {
    // Update local state
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((i) => (i.id === itemId ? { ...i, value } : i)),
      }))
    );

    // Track as pending change
    setPendingChanges((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], value },
    }));
  };

  // Save all pending changes
  const handleSaveChanges = async () => {
    if (!hasPendingChanges) return;

    setIsSaving(true);
    const changes = { ...pendingChanges };
    let hasError = false;

    for (const [itemId, updates] of Object.entries(changes)) {
      const result = await updateChecklistItem(itemId, updates);
      if (!result.success) {
        hasError = true;
        toast.error(`Failed to save changes for an item`);
      }
    }

    setIsSaving(false);

    if (!hasError) {
      setPendingChanges({});
      toast.success("All changes saved");
    }
  };

  // Discard pending changes
  const handleDiscardChanges = () => {
    // Reset to initial values from groups
    refreshData();
    setPendingChanges({});
    toast.success("Changes discarded");
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    const groupWithItem = groups.find((g) => g.items.some((i) => i.id === itemId));
    const deletedItem = groupWithItem?.items.find((i) => i.id === itemId);

    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.filter((i) => i.id !== itemId),
      }))
    );

    // Remove from pending changes
    setPendingChanges((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });

    startTransition(async () => {
      const result = await deleteChecklistItem(itemId);
      if (result.success) {
        toast.success("Item removed");
      } else {
        if (deletedItem && groupWithItem) {
          setGroups((prev) =>
            prev.map((g) =>
              g.id === groupWithItem.id ? { ...g, items: [...g.items, deletedItem] } : g
            )
          );
        }
        toast.error("Failed to delete item");
      }
    });
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb20">
          <div>
            <h4 className="title fz17 mb-1">Inspection Checklists</h4>
            <p className="text-muted fz13 mb-0">Track property inspection items</p>
          </div>

          {/* Progress indicator */}
          {stats.total > 0 && (
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 120 }}>
                <div className="d-flex justify-content-between fz12 mb-1">
                  <span className="text-muted">Progress</span>
                  <span className="fw500">{progressPercent}%</span>
                </div>
                <div
                  className="progress"
                  style={{ height: 6, borderRadius: 3, backgroundColor: "#f0f0f0" }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: progressPercent === 100 ? "#10b981" : "#3b82f6",
                      borderRadius: 3,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
              <div className="text-end">
                <span className="fz13">
                  <span className="fw600 text-success">{stats.completed}</span>
                  <span className="text-muted"> / {stats.total}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Group tabs */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb20 pb15 border-bottom">
          {groups.map((group) => {
            const groupProgress = group.items.length > 0
              ? Math.round((group.items.filter((i) => i.isCompleted).length / group.items.length) * 100)
              : 0;

            return (
              <div key={group.id} className="position-relative">
                {editingGroupId === group.id ? (
                  <div className="d-flex gap-1">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateGroup(group.id);
                        if (e.key === "Escape") setEditingGroupId(null);
                      }}
                      autoFocus
                      style={{ width: 140, borderRadius: 6 }}
                    />
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleUpdateGroup(group.id)}
                      style={{ borderRadius: 6 }}
                    >
                      <i className="fas fa-check" />
                    </button>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => setEditingGroupId(null)}
                      style={{ borderRadius: 6 }}
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                ) : (
                  <button
                    className={`btn btn-sm position-relative ${
                      activeGroupId === group.id
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setActiveGroupId(group.id)}
                    onDoubleClick={() => {
                      setEditingGroupId(group.id);
                      setEditGroupName(group.name);
                    }}
                    style={{
                      borderRadius: 8,
                      padding: "6px 14px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {group.name}
                    {group.items.length > 0 && (
                      <span
                        className="badge ms-2"
                        style={{
                          backgroundColor: groupProgress === 100 ? "#10b981" : activeGroupId === group.id ? "#fff3" : "#e0e0e0",
                          color: groupProgress === 100 ? "#fff" : activeGroupId === group.id ? "#fff" : "#666",
                          fontSize: 10,
                          padding: "3px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {group.items.filter((i) => i.isCompleted).length}/{group.items.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {/* Add group button */}
          <button
            className="btn btn-sm"
            onClick={() => setShowGroupModal(true)}
            style={{
              borderRadius: 8,
              padding: "6px 14px",
              border: "1.5px dashed #ccc",
              color: "#666",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fas fa-plus me-1" style={{ fontSize: 10 }} />
            Add Group
          </button>
        </div>

        {/* Items */}
        {activeGroup ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb15">
              <span className="text-muted fz12">
                <i className="fas fa-info-circle me-1" />
                Double-click group to rename · Click item name to edit
              </span>
              <button
                className="btn btn-sm text-danger"
                onClick={() => handleDeleteGroup(activeGroup.id)}
                style={{ padding: "4px 10px", fontSize: 12 }}
              >
                <i className="fas fa-trash me-1" />
                Delete Group
              </button>
            </div>

            <div className="checklist-items">
              {activeGroup.items.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-clipboard-list text-muted fz30 mb-2 d-block" />
                  <p className="text-muted fz14 mb-3">No items in this checklist yet</p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setShowItemModal(true)}
                    style={{ borderRadius: 8 }}
                  >
                    <i className="fas fa-plus me-1" />
                    Add First Item
                  </button>
                </div>
              ) : (
                <>
                  {activeGroup.items.map((item, index) => {
                    const hasUnsavedChange = !!pendingChanges[item.id];

                    return (
                      <div
                        key={item.id}
                        className={`d-flex align-items-center gap-3 p-3 ${
                          index !== activeGroup.items.length - 1 ? "border-bottom" : ""
                        }`}
                        style={{
                          backgroundColor: item.isCompleted
                            ? "#f8fdf9"
                            : hasUnsavedChange
                            ? "#fffbeb"
                            : "transparent",
                          transition: "background-color 0.2s ease",
                          borderRadius: index === 0 ? "8px 8px 0 0" : index === activeGroup.items.length - 1 ? "0 0 8px 8px" : 0,
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          onClick={() => handleToggleItem(item.id)}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            border: item.isCompleted ? "none" : "2px solid #d1d5db",
                            backgroundColor: item.isCompleted ? "#10b981" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                          }}
                        >
                          {item.isCompleted && (
                            <i className="fas fa-check text-white" style={{ fontSize: 11 }} />
                          )}
                        </div>

                        {/* Item name (clickable to edit) */}
                        <div
                          className="flex-grow-1"
                          onClick={() => handleOpenEditItemModal(item)}
                          style={{
                            textDecoration: item.isCompleted ? "line-through" : "none",
                            color: item.isCompleted ? "#9ca3af" : "#374151",
                            fontWeight: 500,
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                          title="Click to edit item"
                        >
                          {item.name}
                          {hasUnsavedChange && (
                            <span
                              className="ms-2"
                              style={{
                                fontSize: 8,
                                color: "#f59e0b",
                                verticalAlign: "middle",
                              }}
                            >
                              ●
                            </span>
                          )}
                        </div>

                        {/* Value input */}
                        <div style={{ width: 150 }}>
                          {item.valueType === "boolean" ? (
                            <select
                              className="form-select form-select-sm"
                              value={item.value || ""}
                              onChange={(e) => handleValueChange(item.id, e.target.value)}
                              style={{
                                borderRadius: 6,
                                fontSize: 13,
                                borderColor: hasUnsavedChange ? "#f59e0b" : undefined,
                              }}
                            >
                              <option value="">—</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          ) : item.valueType === "date" ? (
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={item.value || ""}
                              onChange={(e) => handleValueChange(item.id, e.target.value)}
                              style={{
                                borderRadius: 6,
                                fontSize: 13,
                                borderColor: hasUnsavedChange ? "#f59e0b" : undefined,
                              }}
                            />
                          ) : (
                            <input
                              type={item.valueType === "number" ? "number" : "text"}
                              className="form-control form-control-sm"
                              placeholder={item.valueType === "number" ? "0" : "Value..."}
                              value={item.value || ""}
                              onChange={(e) => handleValueChange(item.id, e.target.value)}
                              style={{
                                borderRadius: 6,
                                fontSize: 13,
                                borderColor: hasUnsavedChange ? "#f59e0b" : undefined,
                              }}
                            />
                          )}
                        </div>

                        {/* Type badge (clickable to edit) */}
                        <span
                          className="badge"
                          onClick={() => handleOpenEditItemModal(item)}
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            fontSize: 10,
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                          title="Click to edit item"
                        >
                          {VALUE_TYPES.find((t) => t.value === item.valueType)?.label}
                        </span>

                        {/* Delete button */}
                        <button
                          className="btn btn-sm p-1 text-muted"
                          onClick={() => handleDeleteItem(item.id)}
                          style={{ opacity: 0.5, transition: "opacity 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
                        >
                          <i className="fas fa-trash-alt" style={{ fontSize: 12 }} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add item button */}
                  <button
                    className="btn w-100 mt-2 text-primary"
                    onClick={() => setShowItemModal(true)}
                    style={{
                      padding: "10px",
                      border: "1.5px dashed #e0e0e0",
                      borderRadius: 8,
                      backgroundColor: "transparent",
                      fontSize: 13,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <i className="fas fa-plus me-2" style={{ fontSize: 10 }} />
                    Add Item
                  </button>
                </>
              )}
            </div>

            {/* Save Changes Bar */}
            {hasPendingChanges && (
              <div
                className="d-flex align-items-center justify-content-between mt-3 p-3"
                style={{
                  backgroundColor: "#fffbeb",
                  borderRadius: 8,
                  border: "1px solid #fcd34d",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-exclamation-circle text-warning" />
                  <span className="fz13 fw500">
                    You have unsaved changes ({Object.keys(pendingChanges).length} item
                    {Object.keys(pendingChanges).length > 1 ? "s" : ""})
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-light"
                    onClick={handleDiscardChanges}
                    disabled={isSaving}
                    style={{ borderRadius: 6, padding: "5px 12px", fontSize: 12 }}
                  >
                    Discard
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    style={{ borderRadius: 6, padding: "5px 12px", fontSize: 12 }}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#f3f4f6",
                borderRadius: 16,
              }}
            >
              <i className="fas fa-clipboard-list text-muted fz24" />
            </div>
            <h6 className="mb-2">No Checklists Yet</h6>
            <p className="text-muted fz13 mb-3">
              Create a checklist group to start tracking inspection items
            </p>
            <button
              className="btn btn-dark btn-sm"
              onClick={() => setShowGroupModal(true)}
              style={{ borderRadius: 8, padding: "8px 20px" }}
            >
              <i className="fas fa-plus me-2" />
              Create Checklist
            </button>
          </div>
        )}
      </div>

      {/* Add Group Modal */}
      {showGroupModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={handleCloseGroupModal}
          />
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ zIndex: 1055 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseGroupModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
              <div
                className="modal-content"
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw600 fz17">
                    <i className="fas fa-folder-plus me-2 text-primary" />
                    New Checklist Group
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseGroupModal}
                  />
                </div>

                <div className="modal-body">
                  <p className="text-muted fz13 mb-3">
                    Organize inspection items into groups like "Pest Inspection" or "Roof Condition".
                  </p>

                  <input
                    ref={groupInputRef}
                    type="text"
                    className="form-control"
                    placeholder="Group name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateGroup();
                      }
                    }}
                    style={{ borderRadius: 8, padding: "10px 14px" }}
                  />

                  {groups.length > 0 && (
                    <div className="mt-3">
                      <span className="fz12 text-muted">Existing: </span>
                      {groups.map((g, i) => (
                        <span key={g.id} className="fz12 text-muted">
                          {g.name}{i < groups.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 pt-0" style={{ gap: 8 }}>
                  <button
                    className="btn btn-light"
                    onClick={handleCloseGroupModal}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim()}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Item Modal */}
      {showItemModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={handleCloseItemModal}
          />
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ zIndex: 1055 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseItemModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
              <div
                className="modal-content"
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw600 fz17">
                    <i className="fas fa-plus-circle me-2 text-primary" />
                    Add Checklist Item
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseItemModal}
                  />
                </div>

                <div className="modal-body">
                  <p className="text-muted fz13 mb-3">
                    Add an item to "{activeGroup?.name}"
                  </p>

                  <div className="mb-3">
                    <label className="form-label fw500 fz13">Item Name</label>
                    <input
                      ref={itemInputRef}
                      type="text"
                      className="form-control"
                      placeholder="e.g., Check for water damage"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateItem();
                        }
                      }}
                      style={{ borderRadius: 8, padding: "10px 14px" }}
                    />
                  </div>

                  <div>
                    <label className="form-label fw500 fz13">Value Type</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {VALUE_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          className={`btn btn-sm ${
                            newItemValueType === type.value ? "btn-dark" : "btn-outline-secondary"
                          }`}
                          onClick={() => setNewItemValueType(type.value as ValueType)}
                          style={{ borderRadius: 6, padding: "6px 12px", fontSize: 12 }}
                        >
                          <i className={`fas ${type.icon} me-1`} style={{ fontSize: 10 }} />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0" style={{ gap: 8 }}>
                  <button
                    className="btn btn-light"
                    onClick={handleCloseItemModal}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleCreateItem}
                    disabled={!newItemName.trim()}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && editingItem && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={handleCloseEditItemModal}
          />
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ zIndex: 1055 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseEditItemModal();
            }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
              <div
                className="modal-content"
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw600 fz17">
                    <i className="fas fa-edit me-2 text-primary" />
                    Edit Checklist Item
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseEditItemModal}
                  />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw500 fz13">Item Name</label>
                    <input
                      ref={editItemInputRef}
                      type="text"
                      className="form-control"
                      placeholder="Item name..."
                      value={editItemName}
                      onChange={(e) => setEditItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleUpdateItemDetails();
                        }
                      }}
                      style={{ borderRadius: 8, padding: "10px 14px" }}
                    />
                  </div>

                  <div>
                    <label className="form-label fw500 fz13">Value Type</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {VALUE_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          className={`btn btn-sm ${
                            editItemValueType === type.value ? "btn-dark" : "btn-outline-secondary"
                          }`}
                          onClick={() => setEditItemValueType(type.value as ValueType)}
                          style={{ borderRadius: 6, padding: "6px 12px", fontSize: 12 }}
                        >
                          <i className={`fas ${type.icon} me-1`} style={{ fontSize: 10 }} />
                          {type.label}
                        </button>
                      ))}
                    </div>
                    {editItemValueType !== editingItem.valueType && (
                      <p className="text-warning fz12 mt-2 mb-0">
                        <i className="fas fa-exclamation-triangle me-1" />
                        Changing the type will clear the current value
                      </p>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0" style={{ gap: 8 }}>
                  <button
                    className="btn btn-light"
                    onClick={handleCloseEditItemModal}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleUpdateItemDetails}
                    disabled={!editItemName.trim()}
                    style={{ borderRadius: 8, padding: "8px 20px" }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
