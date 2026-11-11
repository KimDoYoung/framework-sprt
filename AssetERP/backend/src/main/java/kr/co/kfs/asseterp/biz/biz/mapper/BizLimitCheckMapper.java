package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCheckParam;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitCompanyYearRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonDayRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizLimitPersonYearRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** AS-IS server/biz/mapper/biz01_promo.xml selectByPersonDay·selectByPersonYear·selectByCompanyYear (L07 이익제공 한도초과현황) */
@Mapper
public interface BizLimitCheckMapper {
    /** 인별 1회 초과건 */
    List<BizLimitPersonDayRes> selectByPersonDay(BizLimitCheckParam param);

    /** 인별 연간 초과건 */
    List<BizLimitPersonYearRes> selectByPersonYear(BizLimitCheckParam param);

    /** 회사별 연간 초과건 */
    List<BizLimitCompanyYearRes> selectByCompanyYear(BizLimitCheckParam param);
}
