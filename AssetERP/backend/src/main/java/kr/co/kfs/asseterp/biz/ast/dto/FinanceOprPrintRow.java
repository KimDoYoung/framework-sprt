package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** sys99_print 한 행(Sys99_Print.insertRdFinanceBookOpr2) — 보유내역 + 매수내역 + 매도내역을 한 줄에 합친다 */
public class FinanceOprPrintRow {
    // 보유내역
    public String string01, string02, string03, string04, string05;
    public LocalDate date01, date02;
    public Double double01, double02, double03, double04, double05;
    public Long long01, long02, long03, long04, long05, long48, long49, long50;
    // 매수내역
    public LocalDate date05;
    public Double double10, double11;
    public Long long10, long11;
    // 매도내역
    public LocalDate date06;
    public Double double15, double16, double17;
    public Long long15, long16, long17, long18, long19;

    /** 같은 보유내역 + 매수·매도 칸은 비운 새 행 */
    public FinanceOprPrintRow copyHoldings() {
        FinanceOprPrintRow r = new FinanceOprPrintRow();
        r.string01 = string01; r.string02 = string02; r.string03 = string03; r.string04 = string04; r.string05 = string05;
        r.date01 = date01; r.date02 = date02;
        r.double01 = double01; r.double02 = double02; r.double03 = double03; r.double04 = double04; r.double05 = double05;
        r.long01 = long01; r.long02 = long02; r.long03 = long03; r.long04 = long04; r.long05 = long05;
        r.long48 = long48; r.long49 = long49;
        return r;
    }
}
