package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch04CheckStatusRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04CheckStatusSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04DailyCheckRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSearchCond;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04TodoSearchCond;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface SchListMapper {

    /** AS-IS dbConfig.getBizDate (type '-1' / '+1') */
    LocalDate selectBizDate(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("type") String type);

    /** AS-IS sch04_list.selectByIcs */
    List<Sch04ListRes> selectByIcs(Sch04ListSearchCond cond);

    /** AS-IS sch04_list.selectById (저장·처리결과 뒤 한 행). 회사 범위를 더했다 */
    Sch04ListRes selectById(@Param("companyId") Long companyId, @Param("listId") Long listId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Sch04_List.upsert → sch04_list.insert */
    int insert(@Param("listId") Long listId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("r") Sch04ListSaveReq r);

    /** AS-IS sch04_list.updatePersonId */
    int updatePersonId(@Param("companyId") Long companyId, @Param("listId") Long listId, @Param("personId") Long personId,
                       @Param("manageDate") LocalDate manageDate, @Param("statusCode") String statusCode);

    /** AS-IS sch04_list.updateNote */
    int updateNote(@Param("companyId") Long companyId, @Param("listId") Long listId, @Param("note") String note);

    /** AS-IS sch04_list.updateConfirm */
    int updateConfirm(@Param("companyId") Long companyId, @Param("listId") Long listId, @Param("confirmYn") String confirmYn,
                      @Param("confirmDate") LocalDate confirmDate, @Param("confirmerId") Long confirmerId);

    /** AS-IS sch04_list.selectByManagerId (O04 업무일정 처리) */
    List<Sch04TodoRes> selectByManagerId(Sch04TodoSearchCond cond);

    /** AS-IS sch04_list.confirmUpdate (O04 저장 — 이미 있는 행). 회사 범위를 더했다 */
    int confirmUpdate(@Param("companyId") Long companyId, @Param("listId") Long listId, @Param("statusCode") String statusCode,
                      @Param("manageDate") LocalDate manageDate, @Param("personId") Long personId, @Param("note") String note);

    /** AS-IS sch04_list.selectByManagerId (O05 데일리 체크리스트 — 데일리 일정만, 결재 열 포함) */
    List<Sch04DailyCheckRes> selectByDailyCheck(Sch04TodoSearchCond cond);

    /** AS-IS sch04_list.selectByCheck (O05) — 같은 일정·담당자·마감일의 처리 행 ID, 없으면 null. 회사 범위를 더했다 */
    Long selectByCheck(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("managerId") Long managerId, @Param("closeDate") LocalDate closeDate);

    /** AS-IS sch04_list.updateStatusCode (O05). 회사 범위를 더했다 */
    int updateStatusCode(@Param("companyId") Long companyId, @Param("listId") Long listId, @Param("statusCode") String statusCode,
                         @Param("manageDate") LocalDate manageDate, @Param("personId") Long personId);

    /** AS-IS sch04_list.selectCheckListStatus (O06 업무일정 체크내역) */
    List<Sch04CheckStatusRes> selectCheckListStatus(Sch04CheckStatusSearchCond cond);
}
