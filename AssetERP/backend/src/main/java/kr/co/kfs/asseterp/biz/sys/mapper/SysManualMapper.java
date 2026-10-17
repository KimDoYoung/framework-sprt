package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.ManualRes;
import kr.co.kfs.asseterp.biz.sys.dto.ManualSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/sys/mapper/sys95_manual.xml (selectByText·selectById·insert·checkManualType) + UpdateDataModel 저장·삭제를 명시 SQL로 */
@Mapper
public interface SysManualMapper {
    /** AS-IS sys95_manual.selectByText (manualType·searchText는 LIKE 패턴, publicCheck=true면 공개된 것만) */
    List<ManualRes> selectByText(@Param("manualType") String manualType, @Param("searchText") String searchText,
                                 @Param("publicCheck") boolean publicCheck);

    /** AS-IS sys95_manual.selectById (저장 뒤 다시 읽기) */
    ManualRes selectById(@Param("manualId") Long manualId);

    /** AS-IS dbConfig.getSeq (= f_create_seq) */
    Long selectNextId();

    /** AS-IS sys95_manual.insert (FileUpload.uploadSys95) */
    int insertManual(@Param("manualId") Long manualId, @Param("companyId") Long companyId, @Param("manualType") String manualType);

    int updateManual(@Param("r") ManualSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deleteManuals(@Param("ids") List<Long> ids);

    /** AS-IS sys95_manual.checkManualType */
    int checkManualType(@Param("companyId") Long companyId, @Param("manualType") String manualType);
}
