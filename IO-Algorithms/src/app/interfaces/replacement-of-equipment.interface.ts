import { TableData } from "./table.interface";

export interface ReplacementOfEquipmentData {
  tableData: TableData;
  initialCost: number;
  usefulLife: number;
  planDuration: number;
}