import { TableData } from "./table.interface"

export interface SportsSeriesData{
  sumOfGames: number,
  homeWinningChanceA: number,
  awayWinningChanceA: number
  startsInHome: boolean
  gamesOrderForA: boolean[]
  tableData: TableData
}