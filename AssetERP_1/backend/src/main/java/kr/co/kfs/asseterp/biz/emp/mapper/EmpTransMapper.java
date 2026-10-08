package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.TransDeleteParam;
import kr.co.kfs.asseterp.biz.emp.dto.TransRes;
import kr.co.kfs.asseterp.biz.emp.dto.TransRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp03_trans.xml + UpdateDataModel(emp03_trans) */
@Mapper
public interface EmpTransMapper {
    /** AS-IS selectByPersonId (deleteCheck도 이 행 수로 본다) */
    List<TransRes> searchTranses(@Param("companyId") Long companyId, @Param("personId") Long personId);

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
