package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.ExpectProgramRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/scm/mapper/scm03_expect_program.xml (EE16) */
@Mapper
public interface ScmExpectProgramMapper {

    /** AS-IS scm03_expect_program.selectBySrId */
    List<ExpectProgramRes> selectBySrId(@Param("srId") Long srId);

    long selectNextId();

    int insert(@Param("id") long id, @Param("srId") Long srId, @Param("programId") Long programId);

    int delete(@Param("ids") List<Long> ids);
}
