import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { columns, Patient } from "./columns";

interface PatientsTableProps {
  data: Patient[];
}

export function PatientsTable({ data }: PatientsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.accessorKey as string}>
                {col.header as string}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum paciente cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            data.map((patient) => (
              <TableRow key={patient.id}>
                {columns.map((col) => (
                  <TableCell key={col.accessorKey as string}>
                    {col.cell
                      ? col.cell({
                          getValue: () =>
                            patient[col.accessorKey as keyof Patient],
                        })
                      : patient[col.accessorKey as keyof Patient]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
