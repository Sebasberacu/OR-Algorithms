import { Injectable } from "@angular/core";
import { NgxCSVParserError, NgxCsvParser } from "ngx-csv-parser";
import { Observable } from "rxjs";
import { TableData } from "../interfaces/table.interface";

@Injectable({
  providedIn: 'root'
})

export class CsvParser {
  constructor(private ngxCsvParser: NgxCsvParser) {}

  parseCsv(file: File, hasHeader: boolean = false): Observable<TableData> {
    return new Observable(observer => {
      this.ngxCsvParser.parse(file, { header: hasHeader, delimiter: ',' })
        .pipe()
        .subscribe({
          next: (result): void => {
            if (!(result instanceof NgxCSVParserError)) {
              const tableData: TableData = this.convertToTableData(result);
              observer.next(tableData);
              observer.complete();
            }
          },
          error: (error: NgxCSVParserError): void => {
            observer.error(error);
          }
        });
    });
  }

  private convertToTableData(data: any[]): TableData {
    const rowHeaders = data[0].slice(1);                   // First row, excluding the initial empty value
    const colHeaders = data.slice(1).map(row => row[0]);   // First value of each row (excluding the first row)
    const matrix = data.slice(1).map(row => row.slice(1)); // Data matrix, excluding headers

    return { rowHeaders, colHeaders, matrix };
  }
}
