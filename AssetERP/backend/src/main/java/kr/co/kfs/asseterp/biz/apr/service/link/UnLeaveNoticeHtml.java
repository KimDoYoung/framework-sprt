package kr.co.kfs.asseterp.biz.apr.service.link;

import static kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveLinkSeedProvider.checkDoubleNull;
import static kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveLinkSeedProvider.checkNull;
import static kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveLinkSeedProvider.tdColor;
import static kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveLinkSeedProvider.tdEmpty;
import static kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveLinkSeedProvider.tdStColor;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import kr.co.kfs.asseterp.biz.emp.dto.UnLeaveNoticeRow;

/**
 * V39 미사용 연차·월차 일괄 결재문서 본문 (AS-IS client/htmlData/UnLeaveHtmlData.getHtmlContent1_01·1_02·2_01·2_02 L77-561).
 * 표 모양·문구는 원본 그대로, 모델 getter만 record 접근자로 바꿨다. (A15의 02_1/02_2 본문은 UnLeaveLinkSeedProvider)
 */
public final class UnLeaveNoticeHtml {

    private static final String tableStart = "<table border=2 style='border-collapse:collapse; border:0px black solid; font-family:\"NotoCustom\"; font-size:13px; margin:0px; padding:0px; width:100%;'>";
    private static final String tableClose = "</table>";
    private static final String tbodyrStart = "<tbody>";
    private static final String tbodyClose = "</tbody>";
    private static final String trStart = "<tr>";
    private static final String trClose = "</tr>";
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_KOR = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");

    private UnLeaveNoticeHtml() {
    }

    private static String fmt(LocalDate d) {
        return d.format(DATE);
    }

    private static String fmtKor(LocalDate d) {
        return d.format(DATE_KOR);
    }

    public static String html1_01(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02) {
        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  20, "미사용 연차유급휴가일수 통지서", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "[관련법령 : 근로기준법 제 61조]", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     3,     1,    1,     "center",     12, "성 명",        "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.personName()), "none") +
                            tdStColor(     3,     1,    1,     "center",     12, "소 속",        "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.orgName()), "none") +
                            tdStColor(     3,     1,    1,     "center",     12, "입사일자",    "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     fmt(unLeaveModel.hireDate()), "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "[휴가사용 기준일 : " + fmt(unLeaveModel.startDate()) + "]","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     4,     1,    1,     "center",     12, "휴가 발생대상 기간",                "#EAEFF4") +
                            tdStColor(     4,     1,    1,     "center",     12, "휴가 사용대상 기간",                "#EAEFF4") +
                            tdStColor(     2,     1,    1,     "center",     12, "발생휴가<br>(A)",                "#EAEFF4") +
                            tdStColor(     3,     1,    1,     "center",     12, "의무사용연차<br>(B=A*"+unLeaveModel.dutyRt()+"%)",    "#EAEFF4") +
                            tdStColor(     2,     1,    1,     "center",     12, "사용휴가<br>(C)",                "#EAEFF4") +
                            tdStColor(     3,     1,    1,     "center",     12, "미사용휴가<br>(B-C)",            "#EAEFF4") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdColor(     4,     2,    1,     "center",     12,     fmt(unLeaveModel.leaveOccurStartDate()) + "부터<br>" + fmt(unLeaveModel.leaveOccurCloseDate()),    "none") +
                            tdColor(     4,     2,    1,     "center",     12,     fmt(unLeaveModel.leaveTargetStartDate()) + "부터<br>" + fmt(unLeaveModel.leaveTargetCloseDate()),    "none") +
                            tdColor(     2,     2,    1,     "center",     12,     checkDoubleNull(unLeaveModel.totalDays()),     "none") +
                            tdColor(     3,     2,    1,     "center",     12,     checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01))), "none") +
                            tdColor(     2,     2,    1,     "center",     12,     checkDoubleNull(unLeaveModel.useDays()),     "none") +
                            tdColor(     3,     2,    1,     "center",     12,     checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01)) - unLeaveModel.useDays()),    "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "귀하의 현재 의무사용연차 중 미사용 연차유급 휴가일수는 '" + checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01)) - unLeaveModel.useDays()) + "'일 임을 알려드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    fmtKor(date01) + "까지 미사용 연차유급휴가일수의 사용 시기를 지정한 후, 제출부탁드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "※ 제출안내 : Asset-ERP > 신청 > 03.휴가 > 연차휴가 지정통보","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "※ 실제 휴가 사용 시 휴가신청서 별도 제출","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "기한내에 \"미사용 연차유급휴가 사용 시기 지정통보\"가 제출되지 아니한 경우 관련 규정에 의해","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "추후 회사가 임의 지정할 예정이며, 그럼에도 불구하고 사용하지 아니한 연차유급휴가일수는","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "소멸하오니 이점 유념하시기 바랍니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    16, fmtKor(date02), "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    20, unLeaveModel.companyName(), "#FFFFFF") +
                        trClose +
                    tbodyClose +
                tableClose;
        
        return text;
    }
    
    public static String html1_02(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02, List<String> month, List<String> day, List<String> dayCount) {

        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  20, "미사용 연차 유급휴가 사용일시 지정 통보", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "< 근로기준법 제 61조(연차유급휴가의 사용촉진) 관련 >", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "1. 대상 근로자","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     2,     1,    1,     "center",     12, "성 명",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.personName()), "none") +
                            tdStColor(     3,     1,    1,     "center",     12, "부 서",        "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.orgName()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "사 번",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.personNo()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "직 위",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.posName()), "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "2. 귀하의 미사용 연차 유급휴가의 사용시기를 아래와 같이 지정하여 통보드리오니, 지정된 날짜에 연차 유급휴가를","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "반드시 사용하시기 바랍니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "※ 만약, 지정된 날짜에 연차 유급휴가를 사용하지 않은 경우에는, 연차유급휴가가 소멸되더라도 연차미사용수당은","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "지급되지 않음을 알려드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "< 미사용 연차유급휴가 사용시기 지정 >", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart +
                            tdEmpty( 1, 1, 0) +
                            tdStColor(  6,     1,    1,     "center",     12, "해당월",        "#EAEFF4") +
                            tdStColor(  6,     1,    1,     "center",     12, "지정일자",    "#EAEFF4") +
                            tdStColor(     6,     1,    1,     "center",     12, "사용일수",    "#EAEFF4") +
                            tdEmpty( 1, 1, 0) +
                        trClose;
        
            for (int i = 0; i < month.size(); i++) {
                text +=    trStart +
                            tdEmpty( 1, 1, 0) +
                            tdColor(     6,     1,    1,     "right",     12, month.get(i)    +" 월 ",     "none") +
                            tdColor(     6,     1,    1,     "right",     12, day.get(i)        +" 일 ",     "none") +
                            tdColor(     6,     1,    1,     "right",     12, dayCount.get(i)    +" 일 ",     "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose;
            }
            
                text +=    trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    16, fmtKor(date02), "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    20, unLeaveModel.companyName(), "#FFFFFF") +
                        trClose +
                    tbodyClose +
                tableClose;
        
        return text;
    }
    
    public static String html2_01(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02) {
        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  20, "미사용 월차유급휴가일수 통지서", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "[관련법령 : 근로기준법 제 61조]", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     3,     1,    1,     "center",     12, "성 명",        "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.personName()), "none") +
                            tdStColor(     3,     1,    1,     "center",     12, "소 속",        "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     checkNull(unLeaveModel.orgName()), "none") +
                            tdStColor(     3,     1,    1,     "center",     12, "입사일자",    "#EAEFF4") +
                            tdColor(     3,     1,    1,     "center",     12,     fmt(unLeaveModel.hireDate()), "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "[휴가사용 기준일 : " + fmt(unLeaveModel.startDate()) + "]","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     4,     1,    1,     "center",     12, "휴가 발생대상 기간",                "#EAEFF4") +
                            tdStColor(     4,     1,    1,     "center",     12, "휴가 사용대상 기간",                "#EAEFF4") +
                            tdStColor(     2,     1,    1,     "center",     12, "발생휴가<br>(A)",                "#EAEFF4") +
                            tdStColor(     3,     1,    1,     "center",     12, "의무사용월차<br>(B=A*"+unLeaveModel.dutyRt()+"%)",    "#EAEFF4") +
                            tdStColor(     2,     1,    1,     "center",     12, "사용휴가<br>(C)",                "#EAEFF4") +
                            tdStColor(     3,     1,    1,     "center",     12, "미사용휴가<br>(B-C)",            "#EAEFF4") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdColor(     4,     2,    1,     "center",     12,     fmt(unLeaveModel.leaveOccurStartDate()) + "부터<br>" + fmt(unLeaveModel.leaveOccurCloseDate()),    "none") +
                            tdColor(     4,     2,    1,     "center",     12,     fmt(unLeaveModel.leaveTargetStartDate()) + "부터<br>" + fmt(unLeaveModel.leaveTargetCloseDate()),    "none") +
                            tdColor(     2,     2,    1,     "center",     12,     checkDoubleNull(unLeaveModel.totalDays()),     "none") +
                            tdColor(     3,     2,    1,     "center",     12,     checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01))), "none") +
                            tdColor(     2,     2,    1,     "center",     12,     checkDoubleNull(unLeaveModel.useDays()),     "none") +
                            tdColor(     3,     2,    1,     "center",     12,     checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01)) - unLeaveModel.useDays()),    "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "귀하의 현재 의무사용월차 중 미사용 월차유급 휴가일수는 '" + checkDoubleNull((unLeaveModel.totalDays()*(unLeaveModel.dutyRt()*0.01)) - unLeaveModel.useDays()) + "'일 임을 알려드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    fmtKor(date01) + "까지 미사용 월차유급휴가일수의 사용 시기를 지정한 후, 제출부탁드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "※ 제출안내 : Asset-ERP > 신청 > 03.휴가 > 연차휴가 지정통보","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "※ 실제 휴가 사용 시 휴가신청서 별도 제출","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "기한내에 \"미사용 월차유급휴가 사용 시기 지정통보\"가 제출되지 아니한 경우 관련 규정에 의해","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "추후 회사가 임의 지정할 예정이며, 그럼에도 불구하고 사용하지 아니한 월차유급휴가일수는","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "소멸하오니 이점 유념하시기 바랍니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    16, fmtKor(date02), "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    20, unLeaveModel.companyName(), "#FFFFFF") +
                        trClose +
                    tbodyClose +
                tableClose;
        
        return text;
    }
    
    public static String html2_02(UnLeaveNoticeRow unLeaveModel, LocalDate date01, LocalDate date02, List<String> month, List<String> day, List<String> dayCount) {

        String text = 
                tableStart + 
                    tbodyrStart + 
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
            
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  20, "미사용 월차 유급휴가 사용일시 지정 통보", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "< 근로기준법 제 61조(월차유급휴가의 사용촉진) 관련 >", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12, "1. 대상 근로자","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     2,     1,    1,     "center",     12, "성 명",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.personName()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "부 서",        "#EAEFF4") +
                            tdColor(     4,     1,    1,     "center",     12,     checkNull(unLeaveModel.orgName()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "사 번",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.personNo()), "none") +
                            tdStColor(     2,     1,    1,     "center",     12, "직 위",        "#EAEFF4") +
                            tdColor(     2,     1,    1,     "center",     12,     checkNull(unLeaveModel.posName()), "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "2. 귀하의 미사용 월차 유급휴가의 사용시기를 아래와 같이 지정하여 통보드리오니, 지정된 날짜에 월차 유급휴가를","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "반드시 사용하시기 바랍니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "※ 만약, 지정된 날짜에 월차 유급휴가를 사용하지 않은 경우에는, 월차유급휴가가 소멸되더라도 월차미사용수당은","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 1, 1, 0) +
                            tdStColor(     19,    1,    0,     "left",     12,    "지급되지 않음을 알려드립니다.","#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",  12, "< 미사용 월차유급휴가 사용시기 지정 >", "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart +
                            tdEmpty( 1, 1, 0) +
                            tdStColor(  6,     1,    1,     "center",     12, "해당월",        "#EAEFF4") +
                            tdStColor(  6,     1,    1,     "center",     12, "지정일자",    "#EAEFF4") +
                            tdStColor(     6,     1,    1,     "center",     12, "사용일수",    "#EAEFF4") +
                            tdEmpty( 1, 1, 0) +
                        trClose;
        
            for (int i = 0; i < month.size(); i++) {
                text +=    trStart +
                            tdEmpty( 1, 1, 0) +
                            tdColor(     6,     1,    1,     "right",     12, month.get(i)    +" 월 ",     "none") +
                            tdColor(     6,     1,    1,     "right",     12, day.get(i)        +" 일 ",     "none") +
                            tdColor(     6,     1,    1,     "right",     12, dayCount.get(i)    +" 일 ",     "none") +
                            tdEmpty( 1, 1, 0) +
                        trClose;
            }
            
                text +=    trStart + 
                            tdEmpty( 20, 1, 0) +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    16, fmtKor(date02), "#FFFFFF") +
                        trClose +
                        trStart + 
                            tdStColor(     20,    1,    0,     "center",    20, unLeaveModel.companyName(), "#FFFFFF") +
                        trClose +
                    tbodyClose +
                tableClose;
        
        return text;
    }
}
