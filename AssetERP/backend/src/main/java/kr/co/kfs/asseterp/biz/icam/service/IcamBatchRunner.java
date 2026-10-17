package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.icam.dto.IcamTestBatchReq;

import java.time.LocalDate;

/**
 * AS-IS BatchMain 서블릿(actionCode=icamFund·extrFund)이 하는 일 — 외부 ICAM DB에서 펀드정보를 읽어 icam03_fund에 넣는다.
 * 외부 DB 연동은 이 프로젝트에 없어(03 원칙 1: asseterpdb만) 기본 구현은 거절한다. 연동이 생기면 이 인터페이스를 구현한다.
 */
public interface IcamBatchRunner {

    /** @param companyId 회사 ID 문자열 또는 "ALL", @param worker 작업자(로그인 사용자 이름) */
    void run(String actionCode, String companyId, String worker);

    /** BatchMain?actionCode=icamOfficeMngFee|icamFundMngFee — 기간(startDate~closeDate)의 발생보수를 가져온다 */
    void runFee(String actionCode, String companyId, String worker, LocalDate startDate, LocalDate closeDate);

    /** icam.Icam50_Source.insertIcamDbSource — 운용서버·자문서버 ICAM 스키마의 all_source를 읽어 icam51_source_tmp에 넣고 icam50_source로 옮긴다 */
    void runSource(String worker);

    /** 작업용 화면(Icam99_Tab_Test)의 BatchMain actionCode — 종목·원장·시세·공모주·알람 등 외부 연동/배치 작업 */
    void runTest(String actionCode, String companyId, String worker, IcamTestBatchReq req);
}
