package kr.co.kfs.asseterp.biz.fbx.mapper;

import kr.co.kfs.asseterp.biz.fbx.dto.FbxHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fbx/mapper/fbx02_history.xml (F11) */
@Mapper
public interface FbxHistoryMapper {
    /** AS-IS selectByBoxId L29 */
    List<FbxHistoryRes> selectByBoxId(@Param("companyId") Long companyId, @Param("boxId") Long boxId);

    /** AS-IS insert L43 (seq는 원본 그대로 max(seq) 또는 1) */
    int insertHistory(@Param("boxId") Long boxId, @Param("actCode") String actCode, @Param("actEmpId") Long actEmpId,
                      @Param("actContent") String actContent, @Param("actOrgCodeId") Long actOrgCodeId);
}
