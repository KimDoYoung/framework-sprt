package kr.co.kfs.asseterp.biz.frm.mapper;

import kr.co.kfs.asseterp.biz.frm.dto.FrmNoticeCntRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/frm/mapper/frm01_list.xml */
@Mapper
public interface FrmListMapper {

    /** AS-IS frm01_list.getNoticeCnt — orgId는 로그인 사원의 현재 조직(회사관리자는 0) */
    FrmNoticeCntRes selectNoticeCnt(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("orgId") Long orgId);
}
