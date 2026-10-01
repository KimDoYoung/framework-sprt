package kr.co.kfs.asseterp.oms.biz.sys.mapper;

import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsageParam;
import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsagePeriodRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.FileUsageRes;
import kr.co.kfs.asseterp.oms.biz.sys.dto.TrashFileRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/** 파일 저장소 sys10_file (AS-IS sys10_file 매퍼) */
@Mapper
public interface SysFileMapper {
    List<FileUsageRes> searchUsage(FileUsageParam param);

    List<FileUsagePeriodRes> searchUsageByYear(FileUsageParam param);

    List<FileUsagePeriodRes> searchUsageByMonth(FileUsageParam param);

    List<TrashFileRes> searchTrashFiles();
}
