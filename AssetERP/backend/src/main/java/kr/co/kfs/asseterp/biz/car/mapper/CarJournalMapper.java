package kr.co.kfs.asseterp.biz.car.mapper;

import kr.co.kfs.asseterp.biz.car.dto.CarJournalBatchReq;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicAdminJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarRelateApprRes;
import kr.co.kfs.asseterp.biz.car.dto.CarPublicJournalRes;
import kr.co.kfs.asseterp.biz.car.dto.CarJournalSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface CarJournalMapper {

    /** AS-IS car04_journal.selectByPrivateJournal */
    List<CarJournalRes> selectByPrivateJournal(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    /** AS-IS car04_journal.selectByDate — 그 날짜 이전(포함) 마지막 일지의 계산된 주행 후 계기판 */
    CarJournalRes selectByDate(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("date") LocalDate date);

    /** AS-IS car04_journal.selectById — 저장 결과 한 행(로그인 회사 행만) */
    CarJournalRes selectById(@Param("companyId") Long companyId, @Param("journalId") Long journalId);

    /** AS-IS car04_journal.getAfterCloseYn 행 수 */
    int countAfterClose(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    /** AS-IS car04_journal.getAfterFixYn 행 수 */
    int countAfterFix(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    /** AS-IS car04_journal.checkDate 행 수 */
    int countByDate(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("date") LocalDate date);

    /** AS-IS sys12_calendar.getWorkDay — 일괄생성 대상일 (회사 1의 달력에서 쉬는 날이 아닌 날, 원본이 회사 1로 고정) */
    List<LocalDate> selectWorkDays(@Param("stdMonth") String stdMonth);

    long selectNextId();

    int insert(@Param("companyId") Long companyId, @Param("journalId") Long journalId, @Param("req") CarJournalSaveReq req);

    /** AS-IS car04_journal.insert — 일괄생성 한 날 */
    int insertBatch(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") CarJournalBatchReq req, @Param("date") LocalDate date);

    int update(@Param("companyId") Long companyId, @Param("req") CarJournalSaveReq req);

    /** 확정·확정취소 — AS-IS UpdateDataModel이 한 행의 모든 열을 쓰므로 조회한 계기판 값도 함께 쓴다 */
    int updateFix(@Param("companyId") Long companyId, @Param("row") CarJournalRes row, @Param("fixYn") boolean fixYn);

    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS car04_journal.selectByPublicJournal — 공용차량 예약 기준(일지가 없는 예약도 나온다). infoId가 null이면 전체 차량 */
    List<CarPublicJournalRes> selectByPublicJournal(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                    @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    /** AS-IS car04_journal.checkBookingId — 그 예약의 일지 행 수 */
    int countByBookingId(@Param("companyId") Long companyId, @Param("bookingId") Long bookingId);

    /** 공용 확정·확정취소: 일지가 있는 예약은 UPDATE */
    int updatePublicFix(@Param("companyId") Long companyId, @Param("row") CarPublicJournalRes row, @Param("fixYn") boolean fixYn);

    /** 공용 확정·확정취소: 일지가 아직 없는 예약은 INSERT (AS-IS updateCheck → modelUpdate가 새 ID로 넣는다) */
    int insertPublicFix(@Param("companyId") Long companyId, @Param("journalId") Long journalId, @Param("row") CarPublicJournalRes row, @Param("fixYn") boolean fixYn);

    /** AS-IS car04_journal.selectByPublicJournalAdmin — 로그인 회사 전체 사용자. searchText는 '%글자%' */
    List<CarPublicAdminJournalRes> selectByPublicJournalAdmin(@Param("companyId") Long companyId, @Param("infoId") Long infoId,
                                                              @Param("stdMonth") String stdMonth, @Param("searchText") String searchText);

    /** 그 예약의 일지 ID (없으면 null) */
    Long selectIdByBookingId(@Param("companyId") Long companyId, @Param("bookingId") Long bookingId);

    /** AS-IS Car04_Journal.delete — 예약을 지울 때 같이 지운다(예약 ID로 찾는다) */
    int deleteByBookingIds(@Param("companyId") Long companyId, @Param("bookingIds") List<Long> bookingIds);

    /** AS-IS car04_journal.selectByJournal — 전용·공용 차량 월 일지 */
    List<CarJournalRes> selectByJournal(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    /** AS-IS car04_journal.getBeforeCloseYn — 그 달 이전에 마감 안 된 일지 수 */
    int countBeforeOpen(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    int updateClose(@Param("companyId") Long companyId, @Param("journalId") Long journalId, @Param("beforeMileage") Long beforeMileage,
                    @Param("afterMileage") Long afterMileage, @Param("closeYn") boolean closeYn);

    /** AS-IS car05_relate_appr.selectByStdMonth — 없으면 null */
    CarRelateApprRes selectRelateAppr(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth);

    int deleteRdPrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    int insertRdJournal(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName,
                        @Param("groupId") Long groupId, @Param("infoId") Long infoId, @Param("stdMonth") String stdMonth,
                        @Param("year") String year, @Param("month") String month);
}
