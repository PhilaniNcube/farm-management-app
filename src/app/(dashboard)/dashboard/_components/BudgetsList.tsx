"use client";

import { useQuery } from "convex/react";

import { useOrganization } from "@clerk/nextjs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BudgetForm } from "./BudgetForm";
import { format } from "date-fns";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

export function BudgetsList() {
  const { organization } = useOrganization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudgetItem, setSelectedBudgetItem] = useState<
    Doc<"budgets"> | undefined
  >(undefined);

  const thisMonthsBudgets = useQuery(
    api.budgets.getThisMonthsBudgets,
    organization ? { organizationId: organization.id } : "skip"
  );

  const nextMonthsBudgets = useQuery(
    api.budgets.getNextMonthsBudgets,
    organization ? { organizationId: organization.id } : "skip"
  );

  const handleEdit = (budgetItem: Doc<"budgets">) => {
    setSelectedBudgetItem(budgetItem);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedBudgetItem(undefined);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <Button onClick={handleAddNew}>Add New Budget Item</Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBudgetItem ? "Edit Budget Item" : "Add New Budget Item"}
            </DialogTitle>
          </DialogHeader>
          <BudgetForm budgetItem={selectedBudgetItem} onClose={closeModal} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetCard
          title="This Month's Budgets"
          budgets={thisMonthsBudgets}
          onEdit={handleEdit}
        />
        <BudgetCard
          title="Next Month's Budgets"
          budgets={nextMonthsBudgets}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}

interface BudgetCardProps {
  title: string;
  budgets: Doc<"budgets">[] | undefined;
  onEdit: (budgetItem: Doc<"budgets">) => void;
}

function BudgetCard({ title, budgets, onEdit }: BudgetCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {budgets && budgets.length > 0 ? (
          <ul className="space-y-2">
            {budgets.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-sm">
                    Amount: ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-sm">
                    Date: {format(new Date(item.dateRequired), "PPP")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No budget items for this period.</p>
        )}
      </CardContent>
    </Card>
  );
}
