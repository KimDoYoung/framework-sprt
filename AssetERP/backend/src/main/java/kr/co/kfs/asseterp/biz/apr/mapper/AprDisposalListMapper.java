package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprDisposalListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr90_disposal_list.xml (F04 폐기문서 신청현황) */
@Mapper
public interface AprDisposalListMapper {
    /** AS-IS selectByPersonId L88 */
    List<AprDisposalListRes> selectByPersonId(@Param("c") AprDisposalListCond cond);
}
