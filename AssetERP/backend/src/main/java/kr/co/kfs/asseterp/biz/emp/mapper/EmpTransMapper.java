package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.TransDeleteParam;
import kr.co.kfs.asseterp.biz.emp.dto.TransPersonRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import kr.co.kfs.asseterp.biz.emp.dto.TransTargetRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransTdmRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** AS-IS server/emp/mapper/emp03_trans.xml + UpdateDataModel(emp03_trans) */
@Mapper
public interface EmpTransMapper {
    /** AS-IS selectByPersonId (deleteCheck도 이 행 수로 본다) */
    List<TransRes> searchTranses(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS selectByText (사원찾기) */
    List<TransPersonRes> searchTransPersons(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                            @Param("transDate") LocalDateTime transDate);

    /** AS-IS selectByText (Emp01_Lookup_TransDate) — separateAddTitle이면 겸직(800)도 제외 */
    List<TransTargetRes> searchTransTargets(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                            @Param("transDate") LocalDate transDate, @Param("separateAddTitle") boolean separateAddTitle);

    /** AS-IS selectByTdmYn (책무 대상 사원찾기 Emp00_Lookup_SelectSingleTdm) — stdDate 'yyyy-MM-dd', orgId는 없으면 null */
    List<TransTdmRes> searchTransTdm(@Param("companyId") Long companyId, @Param("stdDate") String stdDate,
                                     @Param("orgId") Long orgId, @Param("searchText") String searchText);

    /** AS-IS selectById */
    TransRes selectTrans(@Param("transId") Long transId);

    /** AS-IS getSeq */
    Long selectNextId();

    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    int countSameTrans(TransRow row);

    int insertTrans(TransRow row);

    int updateTrans(TransRow row);

    int deleteTranses(TransDeleteParam param);
}
