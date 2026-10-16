package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.org.dto.OrgInfoRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoSearchParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/org/mapper/org00_org_info.xml */
@Mapper
public interface OrgInfoMapper {
    /** AS-IS selectByKorName */
    List<OrgInfoRes> searchOrgInfos(OrgInfoSearchParam param);

    /** AS-IS selectByOrgCodeId */
    OrgInfoRes selectOrgInfo(OrgInfoSearchParam param);
}
