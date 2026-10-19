package kr.co.kfs.asseterp.biz.fbx.mapper;

import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxRes;
import kr.co.kfs.asseterp.biz.fbx.dto.FbxBoxSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/fbx/mapper/fbx01_box.xml (F11 파일등록) */
@Mapper
public interface FbxBoxMapper {
    /** AS-IS selectByCompanyId L38 */
    List<FbxBoxRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS selectById L23 중 이 화면이 쓰는 열 */
    FbxBoxRes selectById(@Param("boxId") Long boxId);

    /** 저장 응답의 새 ID. AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    /** AS-IS UpdateDataModel INSERT — 조직·생성자는 로그인 사용자, 상태 기본 01 */
    int insertBox(@Param("boxId") Long boxId, @Param("companyId") Long companyId, @Param("orgCodeId") Long orgCodeId,
                  @Param("crtEmpId") Long crtEmpId, @Param("r") FbxBoxSaveReq req);

    /** AS-IS UpdateDataModel UPDATE */
    int updateBox(@Param("companyId") Long companyId, @Param("r") FbxBoxSaveReq req);

    /** 삭제 대상의 생성자 (AS-IS는 화면이 첫 행만 검사) */
    List<Long> selectCrtEmpIds(@Param("companyId") Long companyId, @Param("boxIds") List<Long> boxIds);

    /** AS-IS UpdateDataModel DELETE */
    int deleteBoxes(@Param("companyId") Long companyId, @Param("boxIds") List<Long> boxIds);
}
