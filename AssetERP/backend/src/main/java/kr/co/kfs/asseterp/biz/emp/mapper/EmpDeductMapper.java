package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.AddDeductRes;
import kr.co.kfs.asseterp.biz.emp.dto.AddDeductSaveReq;
import kr.co.kfs.asseterp.biz.emp.dto.DeductPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.DeductRes;
import kr.co.kfs.asseterp.biz.emp.dto.DeductSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/Emp35_Deduct.java + Emp36_AddDeduct.java */
@Mapper
public interface EmpDeductMapper {

    /** AS-IS emp35_deduct.selectByStdDate — 기준일의 사원별 최신 급여공제 + 재직구분(transCode 000/100/800/900), personId는 null이면 전체 */
    List<DeductPersonRes> selectByStdDate(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                          @Param("stdDate") LocalDate stdDate, @Param("transCode") String transCode);

    /** AS-IS emp35_deduct.selectByPersonId */
    List<DeductRes> selectDeducts(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextDeductId();

    /** AS-IS emp35_deduct.selectByCompanyId — max start_date ≤ startDate */
    DeductRes selectCurrentDeduct(@Param("companyId") Long companyId,
                                  @Param("personId") Long personId,
                                  @Param("startDate") LocalDate startDate);

    /** AS-IS emp35_deduct.insert (Case 1: 빈 값, Case 2/3: existing 값 복사) */
    int insertDeduct(DeductRes row);

    /** AS-IS emp36_add_deduct.addDeductTypeInsert — 이전 이력 복사 + 빠진 타입 0으로 채움 */
    int insertAddDeductTypes(@Param("deductId") Long deductId,
                             @Param("personId") Long personId,
                             @Param("startDate") LocalDate startDate,
                             @Param("companyId") Long companyId,
                             @Param("itemTypeCodeName") String itemTypeCodeName);

    /** AS-IS emp35_deduct.selectById */
    DeductRes selectDeductById(@Param("deductId") Long deductId, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(emp35_deduct) — 폼 필드 7개 UPDATE */
    int updateDeduct(@Param("deductId") Long deductId, @Param("companyId") Long companyId, DeductSaveReq req);

    /** AS-IS emp35_deduct.deleteByDeductId */
    int deleteDeduct(@Param("deductId") Long deductId, @Param("companyId") Long companyId);

    /** AS-IS emp36_add_deduct.deleteByDeductId */
    int deleteAddDeducts(@Param("deductId") Long deductId);

    /** AS-IS emp36_add_deduct.selectByDeductId */
    List<AddDeductRes> selectAddDeducts(@Param("deductId") Long deductId);

    /** AS-IS UpdateDataModel(emp36_add_deduct) — addDeductCnt만 UPDATE, null → 0 */
    int updateAddDeduct(AddDeductSaveReq req);
}
