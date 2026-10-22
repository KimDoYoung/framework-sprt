package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch02ShareSaveReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch22WriteGroupRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SchWriteGroupMapper {

    /** AS-IS sch22_write_group.selectByCompanyId */
    List<Sch22WriteGroupRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS sch22_write_group.selectById — 로그인 회사 것만(보안 보강) */
    Sch22WriteGroupRes selectById(@Param("companyId") Long companyId, @Param("writeGroupId") Long writeGroupId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS UpdateDataModel INSERT sch22_write_group */
    int insertGroup(@Param("companyId") Long companyId, @Param("writeGroupId") Long writeGroupId, @Param("writeGroupName") String writeGroupName,
                    @Param("confirmerId") Long confirmerId);

    /** AS-IS UpdateDataModel UPDATE sch22_write_group */
    int updateGroup(@Param("companyId") Long companyId, @Param("writeGroupId") Long writeGroupId, @Param("writeGroupName") String writeGroupName,
                    @Param("confirmerId") Long confirmerId);

    /** AS-IS UpdateDataModel DELETE sch22_write_group — 로그인 회사 것만 */
    int deleteGroup(@Param("companyId") Long companyId, @Param("writeGroupId") Long writeGroupId);

    /** AS-IS sch22_write_group.checkByWriteGroupId — 일일점검·체크리스트에서 쓰는 수 */
    int countUse(@Param("writeGroupId") Long writeGroupId);

    /** AS-IS sch02_share.selectByInfoId2 */
    List<Sch02ShareRes> selectSharesByInfoId(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    /** AS-IS sch02_share.selectById */
    Sch02ShareRes selectShareById(@Param("companyId") Long companyId, @Param("shareId") Long shareId);

    /** AS-IS UpdateDataModel INSERT sch02_share */
    int insertShare(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("shareId") Long shareId, @Param("req") Sch02ShareSaveReq req);

    /** AS-IS UpdateDataModel UPDATE sch02_share — 적용기간 */
    int updateShare(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("req") Sch02ShareSaveReq req);

    /** AS-IS sch02_share.checkWriteGroup — 확인된 작성내역이 있는 공유면 1 이상 */
    int countShareWrites(@Param("shareId") Long shareId);

    /** AS-IS UpdateDataModel DELETE sch02_share */
    int deleteShares(@Param("companyId") Long companyId, @Param("infoId") Long infoId, @Param("shareIds") List<Long> shareIds);

    /** AS-IS sch02_share.deleteByInfoId */
    int deleteSharesByInfoId(@Param("companyId") Long companyId, @Param("infoId") Long infoId);
}
