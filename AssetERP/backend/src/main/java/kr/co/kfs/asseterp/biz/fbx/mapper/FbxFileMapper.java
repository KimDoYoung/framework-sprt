package kr.co.kfs.asseterp.biz.fbx.mapper;

import kr.co.kfs.asseterp.biz.fbx.dto.FbxFileRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fbx/mapper/fbx03_file.xml (F11) */
@Mapper
public interface FbxFileMapper {
    /** AS-IS selectByOrgAuth L60 */
    List<FbxFileRes> selectByOrgAuth(@Param("companyId") Long companyId, @Param("boxId") Long boxId, @Param("dcrClassId") Long dcrClassId,
                                     @Param("orgId") Long orgId, @Param("empId") Long empId);

    /** 새 파일 ID. AS-IS IsNewData.getSeq와 같은 식 */
    Long selectNextId();

    /** AS-IS insert L118 (상태 00, 비고 빈 값) */
    int insertFile(@Param("fileId") Long fileId, @Param("boxId") Long boxId, @Param("dcrClassId") Long dcrClassId,
                   @Param("orgCodeId") Long orgCodeId, @Param("empId") Long empId);

    /** 삭제·다운로드 검사용: 이 회사 보관함의 파일 */
    FbxFileRes selectOwned(@Param("companyId") Long companyId, @Param("boxId") Long boxId, @Param("fileId") Long fileId);

    /** AS-IS delete L140 */
    int deleteFile(@Param("fileId") Long fileId);
}
