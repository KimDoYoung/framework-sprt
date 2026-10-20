package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRow;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsManagerMapper {

    /** AS-IS ics02_manager.selectByCompanyId (Ics02_Lookup_Manager) — 미지정 그룹이 맨 앞 */
    List<IcsManagerRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS ics02_manager.getDefaultYn (Ics01_Lookup_Share) — 미지정 관리그룹 */
    IcsManagerRes selectDefault(@Param("companyId") Long companyId);

    /** 관리그룹이 이 회사 것인지 (AS-IS에는 없는 보안 확인) */
    IcsManagerRes selectById(@Param("companyId") Long companyId, @Param("managerId") Long managerId);

    /** AS-IS ics04_share.selectByManagerId (Ics01_Lookup_Share 공유 그리드) */
    List<IcsShareRes> selectSharesByManagerId(@Param("companyId") Long companyId, @Param("managerId") Long managerId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    Long selectNextId();

    /** AS-IS UpdateDataModel ics02_manager INSERT (H10 Ics02_Tab_Manager) */
    int insertManager(IcsManagerRow row);

    /** AS-IS UpdateDataModel ics02_manager UPDATE — 화면이 고치는 그룹명만 */
    int updateManager(@Param("companyId") Long companyId, @Param("managerId") Long managerId, @Param("managerGroupName") String managerGroupName);

    /** AS-IS UpdateDataModel ics02_manager DELETE (로그인 회사 것만) */
    int deleteManagers(@Param("companyId") Long companyId, @Param("managerIds") List<Long> managerIds);

    /** AS-IS ics05_relate_manager.checkRelateIcs — 관리그룹 하나에 연결된 법규 수 */
    int countRelate(@Param("managerId") Long managerId);

    /** AS-IS ics04_share.selectById — 저장한 공유 한 행 */
    IcsShareRes selectShareById(@Param("companyId") Long companyId, @Param("shareId") Long shareId);

    /** AS-IS UpdateDataModel ics04_share INSERT (H10 Ics04_Page_Share) */
    int insertShare(IcsShareRow row);

    /** AS-IS UpdateDataModel ics04_share UPDATE */
    int updateShare(IcsShareRow row);

    /** AS-IS UpdateDataModel ics04_share DELETE (로그인 회사의 그 관리그룹 것만) */
    int deleteShares(@Param("companyId") Long companyId, @Param("managerId") Long managerId, @Param("shareIds") List<Long> shareIds);
}
