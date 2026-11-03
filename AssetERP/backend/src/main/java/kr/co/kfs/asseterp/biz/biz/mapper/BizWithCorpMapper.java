package kr.co.kfs.asseterp.biz.biz.mapper;

import kr.co.kfs.asseterp.biz.biz.dto.BizWithCorpRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/biz/mapper/biz13_with_corp.xml (selectByText) — 운용사 조회창 Biz13_Lookup_WithCorp (EE16) */
@Mapper
public interface BizWithCorpMapper {

    /** AS-IS biz13_with_corp.selectByText — searchText 는 '%…%' */
    List<BizWithCorpRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText);
}
