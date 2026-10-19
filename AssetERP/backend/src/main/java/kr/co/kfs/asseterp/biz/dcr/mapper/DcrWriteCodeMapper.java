package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrWriteCodeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys09_code.xml 중 문서작성 분류 콤보 (selectByDcr01·selectByDcrDetail) */
@Mapper
public interface DcrWriteCodeMapper {
    /** AS-IS selectByDcr01 — 조직(orgId)이 수정 권한을 가진 문서분류 중 level 단계. dcrParentId가 있으면 그 아래만 */
    List<DcrWriteCodeRes> selectClassCodes(@Param("companyId") Long companyId, @Param("orgId") Long orgId,
                                           @Param("level") long level, @Param("dcrParentId") Long dcrParentId);

    /** AS-IS selectByDcrDetail — 문서분류의 세부분류 (조회순) */
    List<DcrWriteCodeRes> selectDetailCodes(@Param("classTreeId") Long classTreeId);
}
