package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.DeductRow;
import kr.co.kfs.asseterp.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransInfoSearchParam;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/emp/mapper/emp00_trans_info.xml + 신규사원 등록(Emp00_TransInfo.update)이 쓰는 SQL */
@Mapper
public interface EmpTransInfoMapper {
    /** AS-IS selectByText */
    List<TransInfoRes> searchTransInfos(TransInfoSearchParam param);

    /** AS-IS selectById (transId) */
    TransInfoRes selectTransInfo(TransInfoSearchParam param);

    /** AS-IS selectOneByPersonId (transCode '%') */
    TransInfoRes selectCurrentTransInfo(TransInfoSearchParam param);

    /** AS-IS getSeq (= f_create_seq) */
    Long selectNextId();

    int countEmpNo(@Param("companyId") Long companyId, @Param("empNo") String empNo);

    /** AS-IS emp02_others.insert */
    int insertOthers(@Param("personId") Long personId);

    /** AS-IS UpdateDataModel(emp01_person) INSERT */
    int insertPerson(PersonRow row);

    /** AS-IS UpdateDataModel(emp03_trans) INSERT */
    int insertTrans(TransRow row);

    /** AS-IS emp35_deduct.insert */
    int insertDeduct(DeductRow row);

    /** AS-IS sys09_code.selectByCodeName(0, 'AddDeductType', 입사일) */
    List<String> selectAddDeductTypes(@Param("startDate") LocalDate startDate);

    /** AS-IS emp36_add_deduct.insert */
    int insertAddDeduct(@Param("deductId") Long deductId, @Param("type") String type);
}
