package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch04ListSearchCond;
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
}
