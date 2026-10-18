package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgParam;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlOrgRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManlOrgMapper {

    /** 부서 책무매뉴얼의 회사 (없으면 null) — 재생성·점검항목 권한 범위 검사용 */
    Long selectCompanyId(@Param("manlOrgId") Long manlOrgId);

    /** AS-IS tdm42_manl_org.selectByText (adminYn=true 고정) */
    List<ManlOrgRes> selectByText(ManlOrgParam param);
}
